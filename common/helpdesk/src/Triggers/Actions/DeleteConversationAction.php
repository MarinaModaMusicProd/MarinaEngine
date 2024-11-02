<?php namespace Helpdesk\Triggers\Actions;

use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

class DeleteConversationAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        $conversation::deleteMultiple([$conversation->id]);
        return $conversation;
    }
}
