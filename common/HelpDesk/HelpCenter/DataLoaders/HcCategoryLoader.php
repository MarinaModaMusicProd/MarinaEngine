<?php

namespace Common\HelpDesk\HelpCenter\DataLoaders;

use Common\HelpDesk\HelpCenter\Models\HcCategory;

class HcCategoryLoader
{
    public function loadData(?string $loader): array
    {
        if (!$loader) {
            $loader = 'categoryPage';
        }

        $categoryId =
            request()->route('sectionId') ?? request()->route('categoryId');
        $category = HcCategory::findOrFail($categoryId);

        $data = ['category' => $category, 'loader' => $loader];

        if ($loader === 'categoryPage') {
            $data['categoryNav'] = (new HcArticleLoader())->loadCategoryNav(
                $category->parent_id ?? $category->id,
            );

            $data['articles'] = $category
                ->articles()
                ->filterByVisibleToRole()
                ->limit(40)
                ->get()
                ->loadPath($category);

            if ($category->is_section) {
                $category->load('parent');
            }
        }

        return $data;
    }
}
