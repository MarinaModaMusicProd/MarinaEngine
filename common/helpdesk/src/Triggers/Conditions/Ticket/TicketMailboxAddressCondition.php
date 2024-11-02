<?php namespace Helpdesk\Triggers\Conditions\Ticket;

use App\Models\Ticket;
use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class TicketMailboxAddressCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if ($conversation instanceof Ticket) {
            return $this->comparator->compare(
                $conversation->received_at_email,
                $conditionValue,
                $operatorName,
            );
        }

        return false;
    }
}
