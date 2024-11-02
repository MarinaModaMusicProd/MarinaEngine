<?php namespace Helpdesk\Triggers\Conditions\Ticket;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class TicketSubjectCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        return $this->comparator->compare(
            $conversation->subject,
            $conditionValue,
            $operatorName,
        );
    }
}
