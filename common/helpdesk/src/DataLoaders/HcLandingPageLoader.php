<?php

namespace Helpdesk\DataLoaders;

use Helpdesk\Models\HcCategory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HcLandingPageLoader
{
    public function loadData(array $options): array
    {
        return [
            'categories' => $this->loadLandingPageData($options),
            'loader' => 'hcLandingPage',
        ];
    }

    protected function loadLandingPageData(array $options)
    {
        $categories = HcCategory::query()
            ->rootOnly()
            ->orderByPosition()
            ->filterByVisibleToRole()
            ->limit(10)
            ->withCount('sections')
            ->with([
                'sections' => function (HasMany $query) {
                    $query
                        ->withCount('articles')
                        ->filterByVisibleToRole()
                        ->with([
                            'articles' => function ($query) {
                                $query->filterByVisibleToRole();
                            },
                        ]);
                },
            ])
            ->get();

        $categoryLimit = $options['categoryLimit'] ?? null;
        $articleLimit = $options['articleLimit'] ?? null;

        $categories->each(function (HcCategory $category) use (
            $categoryLimit,
            $articleLimit,
        ) {
            // limit child category and child category article count
            if ($categoryLimit) {
                $category->setRelation(
                    'sections',
                    $category->sections->take($categoryLimit),
                );
            }
            if ($articleLimit) {
                $category->sections->each(function (HcCategory $child) use (
                    $articleLimit,
                ) {
                    $child->setRelation(
                        'articles',
                        $child->articles->take($articleLimit),
                    );
                });
            }
        });

        return $categories;
    }
}
