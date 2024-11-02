<?php

namespace Helpdesk\Triggers\Conditions\Event;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class EventTypeCondition extends BaseCondition
{
    /**
     * Check if ticket was created or updated.
     */
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if ($operatorName === 'is') {
            if (
                $conditionValue === 'conversation_created' &&
                !$conversationDataBeforeUpdate
            ) {
                return true;
            } elseif (
                $conditionValue === 'conversation_updated' &&
                $conversationDataBeforeUpdate
            ) {
                return true;
            }
        } elseif ($operatorName === 'not') {
            if (
                $conditionValue === 'conversation_created' &&
                $conversationDataBeforeUpdate
            ) {
                return true;
            } elseif (
                $conditionValue === 'conversation_updated' &&
                !$conversationDataBeforeUpdate
            ) {
                return true;
            }
        }

        return false;
    }
}
