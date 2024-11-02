<?php

namespace Livechat\Policies;

use App\Models\User;
use Common\Core\Policies\BasePolicy;
use Illuminate\Auth\Access\Response;

class ChatPolicy extends BasePolicy
{
    public function index(User $user): bool|Response
    {
        return $this->hasPermission($user, 'conversations.view');
    }

    public function show(User $user): bool|Response
    {
        return $this->hasPermission($user, 'conversations.view');
    }

    public function update(User $user): bool|Response
    {
        return $this->hasPermission($user, 'conversations.update');
    }

    public function destroy(User $user, array $chatIds = []): bool|Response
    {
        return $this->hasPermission($user, 'conversations.delete');
    }
}
