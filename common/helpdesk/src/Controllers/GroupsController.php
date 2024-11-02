<?php

namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Helpdesk\Models\Group;

class GroupsController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Group::class);

        $builder = Group::query();

        $with = explode(',', request('with', ''));
        if (in_array('users', $with)) {
            $builder->with(['users.roles', 'users.permissions']);
        }

        $pagination = (new Datasource($builder, request()->all()))->paginate();

        $pagination->through(fn(Group $group) => $group->usersToCompactArray());

        return $this->success(['pagination' => $pagination]);
    }

    public function show(int $groupId)
    {
        $group = Group::with(['users.roles', 'users.permissions'])->findOrFail(
            $groupId,
        );
        $group->usersToCompactArray();

        $this->authorize('show', $group);

        return $this->success(['group' => $group]);
    }

    public function store()
    {
        $this->authorize('store', Group::class);

        $data = request()->validate(
            [
                'name' => 'required|string',
                'users' => 'required|array',
                'users.*' => 'required|array',
                'chat_assignment_mode' => 'required|string',
            ],
            ['users' => __('At least one member is required.')],
        );

        $group = Group::create($data);

        $group->users()->attach(
            collect($data['users'])->mapWithKeys(
                fn($user) => [
                    $user['id'] => ['chat_priority' => $user['chat_priority']],
                ],
            ),
        );

        return $this->success(['group' => $group]);
    }

    public function update(int $groupId)
    {
        $group = Group::findOrFail($groupId);

        $this->authorize('update', $group);

        $data = request()->validate(
            [
                'name' => 'string',
                'users' => 'array',
                'users.*' => 'required|array',
                'chat_assignment_mode' => 'string',
            ],
            ['users' => __('At least one member is required.')],
        );

        $group->update([
            'name' => $data['name'] ?? $group->name,
            'chat_assignment_mode' =>
                $data['chat_assignment_mode'] ?? $group->chat_assignment_mode,
        ]);

        if (isset($data['users'])) {
            $userData = collect($data['users'])->mapWithKeys(
                fn($user) => [
                    $user['id'] => ['chat_priority' => $user['chat_priority']],
                ],
            );
            $group->users()->sync($userData);
        }

        return $this->success(['group' => $group]);
    }

    public function destroy(int $groupId)
    {
        $group = Group::findOrFail($groupId);

        $this->authorize('destroy', $group);

        if ($group->default) {
            return $this->error(__('Default group cannot be deleted.'));
        }

        $group->users()->detach();

        $group->delete();

        return $this->success();
    }
}
