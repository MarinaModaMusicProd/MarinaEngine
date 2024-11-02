<?php

namespace Helpdesk\Controllers;

use App\Models\User;
use Common\Auth\Roles\Role;
use Common\Core\BaseController;
use Helpdesk\Models\Group;
use Livechat\Models\Chat;

class HelpDeskAutocompleteController extends BaseController
{
    public function agents()
    {
        $this->authorize('index', User::class);

        $agents = User::when(
            request('query'),
            fn($q) => $q->mysqlSearch(request('query')),
        )
            ->with(['roles', 'permissions'])
            ->whereAgent()
            ->limit(20)
            ->get()
            ->map(fn(User $user) => $user->toCompactAgentArray());

        return $this->success(['agents' => $agents]);
    }

    public function roles()
    {
        $this->authorize('index', Chat::class);

        $roles = Role::limit(15)
            ->whereHas(
                'permissions',
                fn($q) => $q->whereIn('name', ['conversations.view', 'admin']),
            )
            ->when(
                request('query'),
                fn($q) => $q->mysqlSearch(request('query')),
            )
            ->get();

        return $this->success([
            'roles' => $roles,
            'defaultRoleId' => (
                $roles->first(fn(Role $r) => str_contains($r->name, 'agent')) ??
                $roles->first()
            )->id,
        ]);
    }

    public function groups()
    {
        $this->authorize('index', Chat::class);

        $groups = Group::limit(15)
            ->when(
                request('query'),
                fn($q) => $q->mysqlSearch(request('query')),
            )
            ->get();

        return $this->success([
            'groups' => $groups,
            'defaultGroupId' => $groups->first(fn(Group $g) => $g->default)
                ?->id,
        ]);
    }
}
