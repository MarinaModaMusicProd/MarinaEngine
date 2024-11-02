<?php namespace Helpdesk\Triggers\Conditions\Conversation;

use Helpdesk\Models\Conversation;
use Helpdesk\Models\ConversationItem;
use Helpdesk\Triggers\Conditions\BaseCondition;

class ConversationBodyCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        $latestItem = ConversationItem::find($conversation->last_message_id);

        if ( ! $latestItem) {
            return false;
        }

        return $this->comparator->compare(
            $latestItem->body,
            $conditionValue,
            $operatorName,
        );
    }
}
