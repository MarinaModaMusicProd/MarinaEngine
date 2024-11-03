<?php

namespace Common\HelpDesk\HelpCenter\Models;

use Common\Tags\Tag as BaseTag;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class HcTag extends BaseTag
{
    protected $table = 'tags';

    public function articles(): MorphToMany
    {
        return $this->morphedByMany(HcArticle::class, 'taggable');
    }

    public function categories(): MorphToMany
    {
        return $this->morphedByMany(HcCategory::class, 'taggable')->select([
            'id',
            'name',
        ]);
    }
}
