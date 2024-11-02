<?php

namespace Livechat\Controllers;

use App\Models\User;
use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Common\Database\Datasource\DatasourceFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisitor;

class ChatVisitorsController extends BaseController
{
    public function index()
    {
        $this->authorize('index', User::class);

        $s = [
            Chat::STATUS_OPEN,
            Chat::STATUS_IDLE,
            Chat::STATUS_QUEUED,
            Chat::STATUS_UNASSIGNED,
        ];
        $prefix = DB::getTablePrefix();

        $params = request()->all();

        $builder = ChatVisitor::query()
            ->when(
                !config('common.site.demo'),
                fn(Builder $builder) => $builder->where(function (
                    Builder $builder,
                ) use ($s) {
                    $builder
                        ->where('last_active_at', '>=', now()->subHour())
                        ->orWhereIn('conversations.status', $s);
                }),
            )
            ->with(['user', 'assignee', 'group'])
            ->select(
                'chat_visitors.*',
                DB::raw('MAX(conversations.status) as chat_status'),
                DB::raw('MAX(conversations.assigned_to) as chat_assigned_to'),
                DB::raw('MAX(conversations.group_id) as chat_group_id'),
                DB::raw('MAX(conversations.id) as chat_id'),
                DB::raw('MAX(conversations.created_at) as chat_created_at'),
            )
            ->where('is_crawler', false)
            ->where('banned_at', null)
            ->leftJoin(
                'conversations',
                fn(JoinClause $join) => $join
                    ->on('conversations.visitor_id', '=', 'chat_visitors.id')
                    ->where('conversations.status', '!=', Chat::STATUS_CLOSED),
            )
            ->groupBy('chat_visitors.id');

        $filters = new DatasourceFilters($params['filters'] ?? null);
        $isReturning = $filters->getAndRemove('is_returning');
        if (!is_null($isReturning)) {
            $builder->where('visits_count', $isReturning ? '>' : '=', 1);
        }

        $datasource = new Datasource(
            $builder,
            $params,
            $filters,
            qualifySortColumns: false,
        );

        $datasource->order = false;
        $order = $datasource->getOrder('status');
        if ($order['col'] === 'status') {
            $builder->orderByRaw(
                "FIELD(chat_status, '$s[3]', '$s[2]', '$s[1]', '$s[0]') desc, {$prefix}last_active_at desc",
            );
        } else {
            $builder->orderBy($order['col'], $order['dir']);
        }

        $pagination = $datasource->paginate();

        $pagination->setCollection(
            $pagination
                ->getCollection()
                ->makeUsersCompactWithEmail()
                ->values(),
        );

        return $this->success(['pagination' => $pagination]);
    }

    public function show(int $id)
    {
        $this->authorize('index', User::class);

        $visitor = ChatVisitor::findOrFail($id);
        $visits = $visitor->getLatestVisits();

        return $this->success(['visitor' => $visitor, 'visits' => $visits]);
    }
}
