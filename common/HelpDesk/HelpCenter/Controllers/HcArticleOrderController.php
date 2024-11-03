<?php namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Illuminate\Support\Facades\DB;

class HcArticleOrderController extends BaseController
{
    public function __invoke(HcCategory $category)
    {
        $this->authorize('update', $category);

        $data = $this->validate(request(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer',
        ]);

        $queryPart = '';
        foreach ($data['ids'] as $position => $id) {
            $position++;
            $queryPart .= " when article_id=$id then $position";
        }

        DB::table('category_article')
            ->where('category_id', $category->id)
            ->update([
                'position' => DB::raw("(case $queryPart end)"),
            ]);

        return $this->success();
    }
}
