<?php namespace Helpdesk\Models;

use App\Models\User;
use Common\Core\BaseModel;
use Common\Tags\Taggable;
use Helpdesk\Events\ConversationStatusChanged;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;

abstract class Conversation extends BaseModel
{
    use Searchable, Taggable;

    const CONTENT_MODEL_TYPE = ConversationItem::MODEL_TYPE;

    const STATUS_OPEN = 'open';
    const STATUS_PENDING = 'pending';
    const STATUS_CLOSED = 'closed';

    protected $table = 'conversations';
    public function getForeignKey(): string
    {
        return 'conversation_id';
    }

    protected $guarded = ['id'];
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'assigned_to' => 'integer',
        'group_id' => 'integer',
        'closed_at' => 'datetime',
        'last_message_id' => 'integer',
        'last_event_id' => 'integer',
    ];
    protected $appends = ['model_type'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function scopeWhereGroup(
        Builder $builder,
        int|array $groupIds,
    ): Builder {
        return $builder->whereIn('group_id', Arr::wrap($groupIds));
    }

    protected function attachmentsCount(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (is_numeric($value)) {
                    return (int) $value;
                }

                return DB::table('file_entry_models')
                    ->whereIn('model_id', function ($query) {
                        /** @var $query Builder */
                        return $query
                            ->from('conversation_content')
                            ->where(
                                'conversation_content.conversation_id',
                                $this->id,
                            )
                            ->select('id');
                    })
                    ->where('model_type', static::CONTENT_MODEL_TYPE)
                    ->count();
            },
        );
    }

    public static function changeStatus(
        string $status,
        iterable $conversations,
        bool $fireEvent = true,
    ): iterable {
        if (!($conversations[0] instanceof self)) {
            $conversations = static::whereIn('id', $conversations)->get();
        }
        $conversations = collect($conversations);

        $values = ['status' => $status];
        if ($status === 'closed') {
            $values['closed_at'] = now();
            $user = auth()->user();
            if ($user?->isAgent()) {
                $values['closed_by'] = $user->id;
            }
        } elseif (
            !in_array($status, [Conversation::STATUS_CLOSED, 'locked', 'spam'])
        ) {
            $values['closed_at'] = null;
            $values['closed_by'] = null;
        }

        $conversations = $conversations->map(
            fn($conversation) => $conversation->fill($values),
        );

        static::whereIn('id', $conversations->pluck('id'))->update($values);

        if ($fireEvent) {
            event(new ConversationStatusChanged($conversations));
        }

        return $conversations;
    }

    public static function deleteMultiple(iterable $conversationIds): void
    {
        $itemIds = ConversationItem::whereIn(
            'conversation_id',
            $conversationIds,
        )->pluck('id');

        // detach attachments
        DB::table('file_entry_models')
            ->whereIn('model_id', $itemIds)
            ->where('model_type', static::CONTENT_MODEL_TYPE)
            ->delete();

        // detach tags from conversations
        DB::table('taggables')
            ->whereIn('taggable_id', $conversationIds)
            ->where('taggable_type', static::MODEL_TYPE)
            ->delete();

        // delete conversation content
        ConversationItem::whereIn('id', $itemIds)->delete();

        // delete conversations
        static::whereIn('id', $conversationIds)->delete();
    }

    abstract public function createNote(array $data): ConversationItem;

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->subject,
        ];
    }

    public function toSearchableArray(): array
    {
        return $this->toArray();
    }

    public function makeSearchableUsing(Collection $models)
    {
        return $models->load(['replies', 'user.purchase_codes', 'tags']);
    }

    protected function makeAllSearchableUsing($query)
    {
        return $query->with(['replies', 'user.purchase_codes', 'tags']);
    }

    public static function filterableFields(): array
    {
        return [
            'id',
            'created_at',
            'updated_at',
            'closed_at',
            'assigned_to',
            'group_id',
            'user_id',
            'status',
            'tags',
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
