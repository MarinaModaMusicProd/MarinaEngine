<?php namespace Common\HelpDesk\HelpCenter\Models;

use Common\Core\BaseModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class HcCategory extends BaseModel
{
    use FiltersByVisibleToRole;

    const MODEL_TYPE = 'category';

    protected $table = 'categories';
    protected $hidden = ['pivot'];
    protected $guarded = ['id'];
    protected $appends = ['model_type', 'is_section'];
    protected $casts = [
        'id' => 'integer',
        'parent_id' => 'integer',
        'position' => 'integer',
        'hidden' => 'boolean',
    ];

    protected function getIsSectionAttribute(): bool
    {
        return $this->parent_id !== null;
    }

    public function sections()
    {
        return $this->hasMany(
            HcCategory::class,
            'parent_id',
        )->orderByPosition();
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(HcCategory::class, 'parent_id')->compact();
    }

    public function articles(): BelongsToMany
    {
        $query = $this->belongsToMany(
            HcArticle::class,
            'category_article',
            'category_id',
            'article_id',
        )
            ->where('draft', false)
            ->compact();

        [$col, $dir] = explode(
            '|',
            settings('articles.default_order', 'position|desc'),
        );
        $col === 'position'
            ? $query->orderByPosition()
            : $query->orderBy($col, $dir);

        return $query;
    }

    public function scopeOrderByPosition(Builder $q): Builder
    {
        $prefix = DB::getTablePrefix();
        return $q->orderBy(
            DB::raw(
                "{$prefix}categories.position = 0, {$prefix}categories.position",
            ),
        );
    }

    public function scopeRootOnly(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function scopeCompact(Builder $query): Builder
    {
        return $query->select(['id', 'name', 'parent_id']);
    }

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

    public static function filterableFields(): array
    {
        return ['id', 'created_at', 'updated_at'];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
