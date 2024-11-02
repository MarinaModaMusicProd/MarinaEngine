<?php namespace Helpdesk\Triggers\Conditions\Conversation;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class ConversationAttachmentsCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        return $this->comparator->compare(
            $conversation->attachments_count,
            $conditionValue,
            $operatorName,
        );
    }
}
