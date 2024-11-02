<?php namespace Helpdesk\Triggers\Conditions\Ticket;

use App\Models\Ticket;
use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class TicketCategoryCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if ($conversation instanceof Ticket) {
            foreach ($conversation->categories as $category) {
                if (
                    $this->comparator->compare(
                        $category->name,
                        $conditionValue,
                        $operatorName,
                    )
                ) {
                    return true;
                }
            }
        }

        return false;
    }
}
