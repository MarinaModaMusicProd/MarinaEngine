<?php

namespace Helpdesk\Controllers;

use App\Models\User;
use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Helpdesk\Events\AgentUpdated;
use Helpdesk\Models\AgentSettings;
use Helpdesk\Models\Group;
use Illuminate\Support\Facades\Auth;

class AgentsController extends BaseController
{
    public function index()
    {
        $this->authorize('index', User::class);

        $builder = User::with([
            'roles',
            'permissions',
            'agentSettings',
        ])->whereAgent();

        $pagination = (new Datasource($builder, request()->all()))->paginate();

        $pagination->through(function (User $user) {
            if (!$user->agentSettings) {
                $user->setRelation(
                    'agentSettings',
                    AgentSettings::newFromDefault(),
                );
            }
            $user->setRelation(
                'roles',
                $user->roles->map(fn($role) => $role->toNormalizedArray()),
            );
            return $user;
        });

        return $this->success(['pagination' => $pagination]);
    }

    public function show(int $agentId)
    {
        $agent = User::with([
            'roles',
            'groups',
            'permissions',
            'agentSettings',
            'tokens',
            'social_profiles',
        ])->findOrFail($agentId);

        $this->authorize('show', $agent);

        if (!$agent->agentSettings) {
            $agent->setRelation(
                'agentSettings',
                AgentSettings::newFromDefault(),
            );
        }

        if (Auth::id() === $agentId) {
            $agent->load(['tokens']);
            $agent->makeVisible([
                'two_factor_confirmed_at',
                'two_factor_recovery_codes',
            ]);
            if ($agent->two_factor_confirmed_at) {
                $agent->two_factor_recovery_codes = $agent->recoveryCodes();
                $agent->syncOriginal();
            }
        }

        return $this->success(['agent' => $agent]);
    }

    public function update(int $agentId)
    {
        $agent = User::findOrFail($agentId);

        $this->authorize('update', $agent);

        $data = request()->validate([
            'first_name' => 'string|nullable',
            'last_name' => 'string|nullable',
            'agent_settings.chat_limit' => 'nullable|integer',
            'agent_settings.accepts_chats' => 'nullable|string',
            'agent_settings.working_hours' => 'nullable|array',
            'groups' => 'nullable|array',
            'roles' => 'nullable|array',
        ]);

        if (isset($data['agent_settings'])) {
            $agent
                ->agentSettings()
                ->updateOrCreate(
                    ['user_id' => $agent->id],
                    $data['agent_settings'],
                );
        }

        if (isset($data['groups'])) {
            $agent->groups()->sync(
                collect($data['groups'])->mapWithKeys(
                    fn($groupId) => [
                        $groupId => ['chat_priority' => 'backup'],
                    ],
                ),
            );
        }

        if (isset($data['roles'])) {
            $agent->roles()->sync($data['roles']);
        }

        $agent->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ]);

        event(new AgentUpdated($agent));

        return $this->success(['agent' => $agent]);
    }

    public function destroy(int $agentId)
    {
        $group = Group::findOrFail($agentId);

        $this->authorize('destroy', $group);

        if ($group->default) {
            return $this->error(__('Default group cannot be deleted.'));
        }

        $group->users()->detach();

        $group->delete();

        return $this->success();
    }
}
