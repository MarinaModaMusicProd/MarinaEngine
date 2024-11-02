<?php namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Helpdesk\DataLoaders\HcLandingPageLoader;

class HcLandingPageController extends BaseController
{
    public function __invoke()
    {
        $data = (new HcLandingPageLoader())->loadData([
            'categoryLimit' => settings('hcLanding.children_per_category', 6),
            'articleLimit' => settings('hcLanding.articles_per_category', 5),
        ]);

        return $this->renderClientOrApi([
            'data' => $data,
            'pageName' => 'hc-landing-page',
        ]);
    }
}
