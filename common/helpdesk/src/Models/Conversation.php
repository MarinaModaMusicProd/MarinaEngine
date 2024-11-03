<?php namespace Helpdesk\Models;

use App\Models\User;
use Common\Core\BaseModel;
use Common\Tags\Taggable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Conversation extends BaseModel
{
    use Searchable, Taggable;

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
