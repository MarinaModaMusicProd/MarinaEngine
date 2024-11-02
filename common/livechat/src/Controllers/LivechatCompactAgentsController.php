<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Actions\AgentsLoader;

class LivechatCompactAgentsController extends BaseController
{
    public function __invoke()
    {
        $agents = (new AgentsLoader())->getAllAgents();

        return $this->success(['agents' => $agents]);
    }
}
