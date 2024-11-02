<?php namespace Helpdesk\Models;

use Common\Core\BaseModel;
use Illuminate\Support\Collection;

class Trigger extends BaseModel
{
    const MODEL_TYPE = 'trigger';

    protected $guarded = ['id'];
    protected $appends = ['model_type'];

    public function conditions(): Collection {
        return collect($this->config['conditions']);
    }

    public function actions(): Collection {
        return collect($this->config['actions']);
    }

    protected $casts = [
        'id' => 'integer',
        'times_fired' => 'integer',
        'user_id' => 'integer',
        'config' => 'array',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public static function filterableFields(): array
    {
        return ['id', 'created_at', 'updated_at'];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
