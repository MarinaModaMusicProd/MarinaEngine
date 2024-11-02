<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Livechat\Models\Chat;

class AgentConversationsController extends BaseController
{
    public function __invoke()
    {
        $builder = Chat::query()
            ->with('lastMessage')
            ->where('assigned_to', auth()->id());

        $pagination = (new Datasource($builder, request()->all()))->paginate();

        return $this->success([
            'pagination' => $pagination,
        ]);
    }
}
