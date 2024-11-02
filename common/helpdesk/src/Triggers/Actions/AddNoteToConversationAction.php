<?php namespace Helpdesk\Triggers\Actions;

use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

class AddNoteToConversationAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        $body = $action['value']['note_text'];

        $conversation->createNote([
            'body' => $body,
            'user_id' => $trigger->user_id,
        ]);

        return $conversation;
    }
}
