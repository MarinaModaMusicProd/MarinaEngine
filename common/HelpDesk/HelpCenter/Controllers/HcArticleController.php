<?php namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Common\HelpDesk\HelpCenter\Actions\CrupdateArticle;
use Common\HelpDesk\HelpCenter\DataLoaders\HcArticleLoader;
use Common\HelpDesk\HelpCenter\Jobs\IncrementArticleViews;
use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Common\HelpDesk\HelpCenter\Requests\ModifyHcArticle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class HcArticleController extends BaseController
{
    public function index()
    {
        $this->authorize('index', HcArticle::class);

        $with = explode(',', request('with', ''));
        $builder = in_array('body', $with)
            ? HcArticle::query()
            : HcArticle::compact();

        if (in_array('author', $with)) {
            $builder->with('author');
        }

        if (request('sectionId')) {
            $builder
                ->join(
                    'category_article',
                    'category_article.article_id',
                    '=',
                    'articles.id',
                )
                ->where('category_article.category_id', request('sectionId'));
        }

        if ($tags = request('tags')) {
            $builder->filterByTags($tags);
        }

        if ($draft = request('draft')) {
            $builder->where('draft', (int) $draft);
        }

        $datasource = new Datasource($builder, request()->except('with'));
        $datasource->order = false;

        //order
        $defaultOrder = explode(
            '|',
            request('defaultOrder') ??
                settings('articles.default_order', 'position|desc'),
        );
        $order = $datasource->getOrder($defaultOrder[0], $defaultOrder[1]);

        // order articles by the amount of 'was helpful' user
        // feedback they have in article_feedback table
        if ($order['col'] === 'was_helpful') {
            $builder->orderByFeedback($order['dir']);
        } elseif (Str::endsWith($order['col'], 'position')) {
            $builder->orderByPosition();
        }

        // do a regular order, by a column in main articles table
        else {
            $builder->orderBy($order['col'], $order['dir']);
        }

        $pagination = $datasource->paginate();

        $pagination->transform(function ($article) {
            $article['body'] = Str::limit(
                strip_tags(html_entity_decode($article['body'])),
                200,
            );
            return $article;
        });

        if (in_array('path', $with)) {
            $pagination->loadPath();
        }

        return $this->success([
            'pagination' => $pagination,
            'section' => request('sectionId')
                ? HcCategory::with('parent')->find(request('sectionId'))
                : null,
        ]);
    }

    public function show()
    {
        $data = (new HcArticleLoader())->loadData(request('loader'));
        $articleId = $data['article']['id'];

        $this->authorize('show', $data['article']);

        if (
            request('loader') === 'articlePage' &&
            IncrementArticleViews::shouldIncrement($articleId)
        ) {
            $timestamp = now()->timestamp;
            dispatch(
                new IncrementArticleViews(
                    $data['article']->id,
                    Auth::id(),
                    $timestamp,
                ),
            );
            Session::put("articleViews.$articleId", $timestamp);
        }

        return $this->renderClientOrApi([
            'data' => $data,
            'pageName' => 'article-page',
        ]);
    }

    public function update(HcArticle $article, ModifyHcArticle $request)
    {
        $this->authorize('update', $article);

        $article = (new CrupdateArticle())->execute($request->all(), $article);

        return $this->success(['article' => $article]);
    }

    public function store(ModifyHcArticle $request)
    {
        $this->authorize('store', HcArticle::class);

        $article = (new CrupdateArticle())->execute($request->all());

        return $this->success(['article' => $article], 201);
    }

    public function destroy(string $ids)
    {
        $ids = explode(',', $ids);
        $this->authorize('destroy', HcArticle::class);

        //detach categories
        DB::table('category_article')
            ->whereIn('article_id', $ids)
            ->delete();

        //detach tags
        DB::table('taggables')
            ->whereIn('taggable_id', $ids)
            ->where('taggable_type', HcArticle::MODEL_TYPE)
            ->delete();

        //delete articles
        HcArticle::whereIn('id', $ids)->delete();

        return $this->success();
    }
}
