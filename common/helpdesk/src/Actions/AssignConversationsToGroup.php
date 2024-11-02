<?php

namespace Helpdesk\Actions;

use Helpdesk\Events\ConversationsAssignedToGroup;
use Helpdesk\Events\ConversationsUpdated;
use Helpdesk\Models\Conversation;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AssignConversationsToGroup
{
    public function execute(
        mixed $conversationIds,
        int $groupId,
        string $modelType = 'conversation',
    ): Collection {
        $model = app(Relation::getMorphedModel($modelType));

        $original =
            isset($conversationIds[0]) &&
            $conversationIds[0] instanceof Conversation
                ? $conversationIds
                : $model->whereIn('id', $conversationIds)->get();
        $updatedEvent = new ConversationsUpdated($original);
        $updated = $original;

        $conversationsNotAssignedToGroup = $original->filter(
            fn($conversation) => $conversation->group_id !== $groupId,
        );

        if ($conversationsNotAssignedToGroup->isNotEmpty()) {
            // if conversation is currently assigned to agent not in the new group, unassign it
            $agentsInGroup = DB::table('group_user')
                ->where('group_id', $groupId)
                ->pluck('user_id');
            $conversationsToUnassign = $conversationsNotAssignedToGroup->filter(
                fn($c) => !is_null($c->assigned_to) &&
                    !$agentsInGroup->contains($c->assigned_to),
            );
            if ($conversationsToUnassign->isNotEmpty()) {
                $model
                    ->whereIn('id', $conversationsToUnassign->pluck('id'))
                    ->update(['assigned_to' => null]);
            }

            // assign conversations to group
            $ids = $conversationsNotAssignedToGroup->pluck('id');
            $model->whereIn('id', $ids)->update(['group_id' => $groupId]);
            $updated = $model->whereIn('id', $ids)->get();

            $updatedEvent->dispatch($updated);
            event(new ConversationsAssignedToGroup($updated));
        }

        return $updated;
    }
}
