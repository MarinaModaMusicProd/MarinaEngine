<?php

namespace Helpdesk\Actions;

use Helpdesk\Events\ConversationsAssignedToAgent;
use Helpdesk\Events\ConversationUpdated;
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
        $updated = $original;

        $conversationsNotAssignedToAgent = $original->filter(
            fn($conversation) => $conversation->assigned_to !== $agentId,
        );

        if ($conversationsNotAssignedToAgent->isNotEmpty()) {
            $ids = $conversationsNotAssignedToAgent->pluck('id');
            $model->whereIn('id', $ids)->update(['assigned_to' => $agentId]);
            $updated = $model->whereIn('id', $ids)->get();

            // fire updated event for each updated conversation so triggers are run for each one
            foreach ($original as $k => $originalConversation) {
                event(
                    new ConversationUpdated(
                        $updated[$k],
                        $originalConversation,
                    ),
                );
            }

            event(new ConversationsAssignedToAgent($updated));
        }

        return $updated;
    }
}
