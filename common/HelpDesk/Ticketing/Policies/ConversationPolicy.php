<?php namespace Common\HelpDesk\Ticketing\Policies;

use App\Models\User;
use Common\Core\Policies\BasePolicy;
use Common\HelpDesk\Ticketing\Models\Conversation;
use Illuminate\Database\Eloquent\Collection;

class ConversationPolicy extends BasePolicy
{
    public function index(User $user, $userId = null)
    {
        return $this->hasVariablePermission($user, 'view') ||
            $user->id === (int) $userId;
    }

    public function show(User $user, $ticket)
    {
        return $this->hasVariablePermission($user, 'view') ||
            $user->id === $ticket->user_id;
    }

    public function store(User $user)
    {
        return $this->hasVariablePermission($user, 'create');
    }

    public function update(
        User         $user,
        Conversation $conversation = null,
        Collection   $conversations = null,
    ) {
        if ($this->hasVariablePermission($user, 'update') ) {
            return true;
        }

        if ( $conversations) {
            return $conversations->every('user_id', '=', $user->id);
        }

        if ($conversation) {
            return $conversation->user_id === $user->id;
        }

        return false;
    }

    public function destroy(User $user)
    {
        return $this->hasVariablePermission($user, 'delete');
    }

    protected function hasVariablePermission(User $user, string $action): bool
    {
        return $this->hasPermission($user, "tickets.$action") ||
            $this->hasPermission($user, "conversations.$action");
    }
}
