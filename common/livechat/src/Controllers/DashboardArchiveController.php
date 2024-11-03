<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Common\Database\Datasource\DatasourceFilters;
use Livechat\Models\Chat;

class DashboardArchiveController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Chat::class);

        $params = request()->all();
        $builder = Chat::query();

        $filters = new DatasourceFilters($params['filters'] ?? null);
        $filters->where('status', '=', 'closed');

        $pagination = (new Datasource(
            $builder,
            $params,
            $filters,
            config('scout.driver'),
        ))->paginate();

        $pagination->load([
            'lastMessage',
            'visitor' => fn($q) => $q->compact(),
            'assignee',
        ]);

        $pagination->through(function (Chat $chat) {
            $chat->lastMessage?->makeBodyCompact();
            return $chat;
        });

        $pagination->setCollection(
            $pagination
                ->getCollection()
                ->makeUsersCompactWithEmail()
                ->values(),
        );

        return $this->success([
            'pagination' => $pagination,
        ]);
    }
}
