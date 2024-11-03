<?php

namespace Common\HelpDesk\Ticketing\Actions;

use Common\HelpDesk\Ticketing\Events\ConversationsAssignedToAgent;
use Common\HelpDesk\Ticketing\Events\ConversationUpdated;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;

class AssignConversationsToAgent
{
    public function execute(
        array $conversationIds,
        int $agentId = null,
        string $modelType = 'conversation',
    ): Collection {
        $model = app(Relation::getMorphedModel($modelType));

        $original = $model->whereIn('id', $conversationIds)->get();
        $updated = $original;

        // get only IDs of conversations that are not assigned to this user already
        $conversationIds = array_filter(
            $conversationIds,
            fn($id) => $original->find($id)->assigned_to !==
                $agentId,
        );

        if ($conversationIds) {
            $model->whereIn('id', $conversationIds)->update([
                'assigned_to' => $agentId,
            ]);
            $updated = $model->whereIn('id', $conversationIds)->get();

            // fire updated event for each updated conversation so trigger are run for each one
            foreach ($original as $k => $originalConversation) {
                event(new ConversationUpdated($updated[$k], $originalConversation));
            }

            event(new ConversationsAssignedToAgent($updated));
        }

        return $updated;
    }
}
