<?php namespace Common\HelpDesk\Ticketing\Models;

use App\Models\User;
use Common\Core\BaseModel;
use Common\Files\FileEntry;
use DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class ConversationItem extends BaseModel
{
    use Searchable;

    protected $table = 'conversation_content';

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'conversation_id' => 'integer',
    ];

    protected $guarded = ['id'];
    protected $appends = ['model_type'];
    protected $hidden = ['uuid', 'email_id'];

    public function attachments(): BelongsToMany
    {
        return $this->morphToMany(
            FileEntry::class,
            'model',
            'file_entry_models',
        )->orderBy('file_entries.created_at', 'desc');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeCompact(Builder $q)
    {
        return $q->select(
            'id',
            'user_id',
            DB::raw('SUBSTRING(body, 1, 80) as body'),
        );
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'body' => strip_tags($this->body),
        ];
    }

    public static function filterableFields(): array
    {
        return ['id'];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => strip_tags($this->body),
        ];
    }
}
