<?php namespace Helpdesk\Triggers\Conditions\Visitor;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;
use Livechat\Models\Chat;

class VisitorLocationCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if ($conversation instanceof Chat && $conversation->visitor) {
            return $this->comparator->compare(
                $conversation->visitor->country,
                $conditionValue,
                $operatorName,
            );
        }

        return false;
    }
}
