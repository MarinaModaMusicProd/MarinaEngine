<?php namespace Helpdesk\Policies;

use App\Models\User;
use Common\Core\Policies\BasePolicy;
use Helpdesk\Models\CannedReply;

class CannedReplyPolicy extends BasePolicy
{
    public function index(User $user)
    {
        return $user->hasPermission('canned_replies.view');
    }

    public function show(User $user)
    {
        return $user->hasPermission('canned_replies.view');
    }

    public function store(User $user)
    {
        return $user->hasPermission('canned_replies.create');
    }

    public function update(User $user, CannedReply $reply)
    {
        return $user->hasPermission('canned_replies.update') ||
            $user->id === $reply->user_id;
    }

    public function destroy(User $user)
    {
        return $user->hasPermission('canned_replies.delete');
    }
}
