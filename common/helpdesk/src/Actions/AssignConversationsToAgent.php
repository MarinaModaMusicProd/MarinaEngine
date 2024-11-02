<?php

namespace Helpdesk\Actions;

use Helpdesk\Events\ConversationsAssignedToAgent;
use Helpdesk\Events\ConversationsUpdated;
use Helpdesk\Models\Conversation;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;

class AssignConversationsToAgent
{
    public function execute(
        mixed $conversationIds,
        int $agentId = null,
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

        $conversationsNotAssignedToAgent = $original->filter(
            fn($conversation) => $conversation->assigned_to !== $agentId,
        );

        if ($conversationsNotAssignedToAgent->isNotEmpty()) {
            $ids = $conversationsNotAssignedToAgent->pluck('id');
            $model->whereIn('id', $ids)->update(['assigned_to' => $agentId]);
            $updated = $model->whereIn('id', $ids)->get();

            $updatedEvent->dispatch($updated);
            event(new ConversationsAssignedToAgent($updated));
        }

        return $updated;
    }
}
