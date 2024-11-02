<?php

namespace Helpdesk\Controllers;

use App\Models\User;
use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Helpdesk\Models\AgentInvite;
use Helpdesk\Notifications\AgentInvitation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class AgentInvitesController extends BaseController
{
    public function index()
    {
        $this->authorize('store', User::class);

        $builder = AgentInvite::with(['role', 'group']);

        $pagination = (new Datasource($builder, request()->all()))->paginate();

        return $this->success(['pagination' => $pagination]);
    }

    public function store()
    {
        $this->authorize('store', User::class);

        $data = request()->validate(
            [
                'emails' => 'required|array',
                'emails.*' =>
                    'required|email|unique:users,email|unique:agent_invites,email',
                'role_id' => 'required|int',
                'group_id' => 'required|int',
            ],
            [
                'emails.*.unique' => __(
                    'The email :input has already been invited.',
                ),
            ],
        );

        AgentInvite::insert(
            collect($data['emails'])
                ->map(
                    fn($email) => [
                        'id' => Str::orderedUuid(),
                        'email' => $email,
                        'role_id' => $data['role_id'],
                        'group_id' => $data['group_id'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                )
                ->toArray(),
        );

        AgentInvite::whereIn('email', $data['emails'])
            ->get()
            ->each(
                fn(AgentInvite $invite) => Notification::route(
                    'mail',
                    $invite->email,
                )->notify(new AgentInvitation(Auth::user()->name, $invite->id)),
            );

        return $this->success();
    }

    public function resend(int $inviteId)
    {
        $this->authorize('store', User::class);

        $invite = AgentInvite::findOrFail($inviteId);

        $notification = new AgentInvitation(Auth::user()->name, $invite->id);

        Notification::route('mail', $invite->email)->notify($notification);
        $invite->touch();

        return $this->success();
    }

    public function destroy(int $inviteId)
    {
        $this->authorize('store', User::class);

        $invite = AgentInvite::findOrFail($inviteId);

        $invite->delete();

        return $this->success();
    }
}
