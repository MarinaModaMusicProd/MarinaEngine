<?php

namespace Livechat\Controllers;

use Common\Core\AppUrl;
use Common\Core\BaseController;
use Livechat\Actions\WidgetBootstrapData;

class WidgetHomeController extends BaseController
{
    public function __invoke()
    {
        $bootstrapData = new WidgetBootstrapData();
        return view('livechat::chat-widget')
            ->with('bootstrapData', $bootstrapData)
            ->with('htmlBaseUri', app(AppUrl::class)->htmlBaseUri);
    }
}
