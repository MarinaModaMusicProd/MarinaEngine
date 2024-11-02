<?php

namespace Helpdesk\Controllers;

use App\Models\User;
use Common\Core\BaseController;

class NormalizedAgentModelsController extends BaseController
{
    public function index()
    {
        $this->authorize('index', User::class);

        $agents = User::when(
            request('query'),
            fn($q) => $q->mysqlSearch(request('query')),
        )
            ->whereAgent()
            ->take(15)
            ->get()
            ->map(fn(User $user) => $user->toNormalizedArray());

        return $this->success(['results' => $agents]);
    }

    public function show(int $userId)
    {
        $agent = User::findOrFail($userId);

        $this->authorize('show', $agent);

        return $this->success(['model' => $agent->toNormalizedArray()]);
    }
}
