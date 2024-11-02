<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Models\ChatVisitor;

class MostRecentChatController extends BaseController
{
    public function __invoke()
    {
        return $this->success(ChatVisitor::mostRecentChatForCurrentRequest());
    }
}
