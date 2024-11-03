<?php

namespace Common\HelpDesk\HelpCenter\Actions;

use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Common\HelpDesk\HelpCenter\Models\HcTag;

class CrupdateArticle
{
    public function execute(
        array $data,
        HcArticle $originalArticle = null,
    ): HcArticle {
        $article = $originalArticle ?: new HcArticle();

        $this->saveInlineProps($article, $data);

        if (isset($data['sections'])) {
            $sections = HcCategory::select(['id', 'parent_id'])
                ->whereNotNull('parent_id')
                ->whereIn('id', $data['sections'])
                ->get();
            $ids = $sections->pluck('id')->merge($sections->pluck('parent_id'));
            $article->sections()->sync($ids);
        }

        if (array_key_exists('attachments', $data)) {
            $article->attachments()->sync($data['attachments']);
        }

        if (array_key_exists('tags', $data)) {
            $tags = app(HcTag::class)->insertOrRetrieve($data['tags']);
            $article->tags()->sync($tags->pluck('id'));
        }

        return $article;
    }

    protected function saveInlineProps(HcArticle $article, array $data): void
    {
        $inlineProps = [
            'title',
            'body',
            'slug',
            'description',
            'draft',
            'author_id',
            'position',
            'visible_to_role',
            'managed_by_role',
        ];

        foreach ($inlineProps as $prop) {
            if (array_key_exists($prop, $data)) {
                $article->{$prop} = $data[$prop];
            }
        }

        if (!$article->title) {
            $article->title = __('Untitled');
        }

        $article->save();
    }
}
