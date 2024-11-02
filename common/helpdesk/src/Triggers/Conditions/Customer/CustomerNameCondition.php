<?php namespace Helpdesk\Triggers\Conditions\Customer;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;
use Livechat\Models\Chat;

class CustomerNameCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        return $this->comparator->compare(
            $conversation->user?->name,
            $conditionValue,
            $operatorName,
        ) ||
            ($conversation instanceof Chat &&
                $this->comparator->compare(
                    $conversation->visitor?->name,
                    $conditionValue,
                    $operatorName,
                ));
    }
}
