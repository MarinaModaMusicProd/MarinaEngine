<?php namespace Helpdesk\Triggers\Conditions\Visitor;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;
use Livechat\Models\Chat;

class VisitorVisitsCountCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if ($conversation instanceof Chat && $conversation->visitor) {
            return $this->comparator->compare(
                $conversation->visitor->visits_count,
                $conditionValue,
                $operatorName,
            );
        }

        return false;
    }
}
