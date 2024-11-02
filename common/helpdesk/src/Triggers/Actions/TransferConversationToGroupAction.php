<?php namespace Helpdesk\Triggers\Actions;

use Helpdesk\Actions\AssignConversationsToGroup;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

class TransferConversationToGroupAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        $groupId = $action['value']['group_id'];
        return (new AssignConversationsToGroup())
            ->execute([$conversation->id], $groupId, $conversation->model_type)
            ->first();
    }
}
