<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Actions\PaginateChatMessages;

class DashboardChatMessagesController extends BaseController
{
    public function index()
    {
        $pagination = (new PaginateChatMessages())->execute(request()->all());

        return $this->success(['pagination' => $pagination]);
    }
}
