<?php namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Illuminate\Support\Facades\DB;

class HcCategoryOrderController extends BaseController
{
    public function __invoke()
    {
        $this->authorize('update', HcArticle::class);

        $data = $this->validate(request(), [
            'parentId' => 'integer|nullable',
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer',
        ]);

        $queryPart = '';
        foreach ($data['ids'] as $position => $id) {
            $position++;
            $queryPart .= " when id=$id then $position";
        }

        HcCategory::where('parent_id', $data['parentId'] ?? null)->update([
            'position' => DB::raw("(case $queryPart end)"),
        ]);

        return $this->success();
    }
}
