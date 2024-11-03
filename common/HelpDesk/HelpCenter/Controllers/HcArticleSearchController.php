<?php

namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\HelpDesk\HelpCenter\Actions\SearchHcArticles;
use Common\HelpDesk\HelpCenter\Models\HcArticle;

class HcArticleSearchController extends BaseController
{
    public function __invoke()
    {
        $this->authorize('index', HcArticle::class);

        $params = request()->all();
        if (!isset($params['query'])) {
            $params['query'] = request()->route('query');
        }

        $data = (new SearchHcArticles())->execute($params);

        return $this->renderClientOrApi([
            'data' => $data,
            'pageName' => 'search-page',
        ]);
    }
}
