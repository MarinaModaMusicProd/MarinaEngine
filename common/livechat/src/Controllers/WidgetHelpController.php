<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\DataLoaders\HcLandingPageLoader;

class WidgetHelpController extends BaseController
{
    public function helpCenterData()
    {
        $data = (new HcLandingPageLoader())->loadData([
            'categoryLimit' => 30,
            'articleLimit' => 50,
        ]);

        return $this->success($data);
    }
}
