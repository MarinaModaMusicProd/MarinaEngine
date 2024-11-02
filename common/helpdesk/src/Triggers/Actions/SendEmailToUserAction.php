<?php namespace Helpdesk\Triggers\Actions;

use App\Models\User;
use App\Notifications\TriggerEmailNotification;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\ConversationItem;
use Helpdesk\Models\Trigger;

class SendEmailToUserAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        $data = $action['value'];
        $user = User::find($data['agent_id']);

        if ($user) {
            $data['conversation'] = $conversation->toArray();
            $data['user'] = $user->toArray();
            if ($conversation->last_message_id) {
                $data['last_message'] = ConversationItem::find(
                    $conversation->last_message_id,
                )->toArray();
            }

            $user->notify(new TriggerEmailNotification($data));
        }

        return $conversation;
    }
}
