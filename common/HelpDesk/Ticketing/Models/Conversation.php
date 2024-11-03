<?php namespace Common\HelpDesk\Ticketing\Models;

use App\Models\Reply;
use App\Models\Tag;
use App\Models\User;
use Common\Core\BaseModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;

class Conversation extends BaseModel
{
    use Searchable;

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
        'department_id' => 'integer',
        'closed_at' => 'datetime',
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

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')->select([
            'id',
            'name',
            'display_name',
            'type',
        ]);
    }

    protected function scopeWhereTag(
        Builder $builder,
        string $tag,
        string $operator = '=',
    ): Builder {
        return $builder->whereHas('tags', function (Builder $tb) use (
            $tag,
            $operator,
        ) {
            $tb->where('name', $operator, $tag);
        });
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'replies' => $this->replies->map(function (Reply $reply) {
                return $reply->toSearchableArray();
            }),
            'user' => $this->user ? $this->user->toSearchableArray() : null,
            'user_id' => $this->user ? $this->user->id : null,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'closed_at' => $this->closed_at->timestamp ?? '_null',
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->subject,
        ];
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
            'department_id',
            'user_id',
            'status',
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
