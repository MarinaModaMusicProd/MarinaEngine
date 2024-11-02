<?php

namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\HelpCenter\SearchHcArticles;
use Helpdesk\Models\HcArticle;

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
            'pageName' => 'hc-search-page',
        ]);
    }
}
