<?php namespace Helpdesk\Triggers\Actions;

use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

class ChangeConversationStatusAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        $statusName = $action['value']['status_name'];

        $conversation::changeStatus(
            $statusName,
            [$conversation->id],
            fireEvent: false,
        );

        // 'unload' tags relationship in case it was already loaded
        // on given ticket so removed tags are properly removed
        // the next time tags/status relationship is accessed on this ticket
        $conversation->unsetRelation('tags');

        return $conversation;
    }
}
