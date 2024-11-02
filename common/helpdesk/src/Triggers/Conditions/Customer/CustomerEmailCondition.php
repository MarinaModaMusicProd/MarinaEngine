<?php namespace Helpdesk\Triggers\Conditions\Customer;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;
use Livechat\Models\Chat;

class CustomerEmailCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        return $this->comparator->compare(
            $conversation->user?->email,
            $conditionValue,
            $operatorName,
        ) ||
            ($conversation instanceof Chat &&
                $conversation->visitor &&
                $this->comparator->compare(
                    $conversation->visitor->email,
                    $conditionValue,
                    $operatorName,
                ));
    }
}
