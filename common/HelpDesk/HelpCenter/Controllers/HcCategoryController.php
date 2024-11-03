<?php namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Common\HelpDesk\HelpCenter\DataLoaders\HcCategoryLoader;
use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Common\HelpDesk\HelpCenter\Requests\ModifyHcCategory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class HcCategoryController extends BaseController
{
    public function index()
    {
        $this->authorize('index', HcArticle::class);

        $params = request()->all();
        $params['order'] = 'position|asc';
        $builder = HcCategory::when(
            request('compact'),
            fn($q) => $q->compact(),
        )->withCount('articles');

        if (request('parentId')) {
            $builder->where('parent_id', request('parentId'));
        } elseif (request('type') === 'category') {
            $builder->whereNull('parent_id');
            $builder->withCount('sections');
        } elseif (request('type') === 'section') {
            $builder->whereNotNull('parent_id');
        }

        foreach (explode(',', request('load', '')) as $load) {
            if ($load === 'sections') {
                $builder->with(['sections' => fn($query) => $query->compact()]);
            }
        }

        $datasource = new Datasource($builder, $params);

        return $this->success([
            'pagination' => $datasource->paginate(),
            'category' => request('parentId')
                ? HcCategory::find(request('parentId'))
                : null,
        ]);
    }

    public function show()
    {
        $data = (new HcCategoryLoader())->loadData(request('loader'));
        $this->authorize('show', $data['category']);

        return $this->renderClientOrApi([
            'data' => $data,
            'pageName' => 'category-page',
        ]);
    }

    public function store(ModifyHcCategory $request)
    {
        $this->authorize('store', HcArticle::class);

        $last = HcCategory::orderBy('position', 'desc')->first();

        $category = HcCategory::create([
            'name' => request('name'),
            'description' => request('description'),
            'image' => request('image', null),
            'parent_id' => request('parent_id', null),
            'position' => $last ? $last->position + 1 : 1,
            'managed_by_role' => request('managed_by_role', null),
            'visible_to_role' => request('visible_to_role', null),
        ]);

        return $this->success(['category' => $category]);
    }

    public function update(int $id, ModifyHcCategory $request)
    {
        $this->authorize('update', HcArticle::class);

        $category = HcCategory::findOrFail($id);

        $category->fill(request()->all())->save();

        return $this->success(['category' => $category]);
    }

    public function destroy(int $id)
    {
        $this->authorize('destroy', HcArticle::class);

        $category = HcCategory::findOrFail($id);

        $category
            ->where('parent_id', $category->id)
            ->update(['parent_id' => null]);

        $category->articles()->detach();

        $category->delete();

        return $this->success();
    }

    public function sidenavContent(int $categoryId)
    {
        $this->authorize('index', HcArticle::class);

        $categories = HcCategory::where('parent_id', $categoryId)
            ->orderByPosition()
            ->with([
                'articles' => function (BelongsToMany $query) {
                    $query->select('id', 'title', 'position', 'slug');
                },
            ])
            ->limit(10)
            ->get();

        return $this->success(['sections' => $categories]);
    }
}
