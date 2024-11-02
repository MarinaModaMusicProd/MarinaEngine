<?php namespace Helpdesk\Triggers\Conditions\Conversation;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class ConversationStatusCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if (!$conversation->status) {
            return false;
        }

        return match ($operatorName) {
            'is' => $this->comparator->compare(
                $conversation->status,
                $conditionValue,
                'equals',
            ),
            'not' => $this->comparator->compare(
                $conversation->status,
                $conditionValue,
                'not_equals',
            ),
            'changed' => $this->statusChanged(
                $conversation,
                $conversationDataBeforeUpdate,
            ),
            'not_changed' => !$this->statusChanged(
                $conversation,
                $conversationDataBeforeUpdate,
            ),
            'changed_to' => $this->statusChanged(
                $conversation,
                $conversationDataBeforeUpdate,
            ) &&
                $this->comparator->compare(
                    $conversation->status,
                    $conditionValue,
                    'equals',
                ),
            'not_changed_to' => $this->statusChanged(
                $conversation,
                $conversationDataBeforeUpdate,
            ) &&
                $this->comparator->compare(
                    $conversation->status,
                    $conditionValue,
                    'not_equals',
                ),
            'changed_from' => $this->statusChanged(
                $conversation,
                $conversationDataBeforeUpdate,
            ) &&
                $this->comparator->compare(
                    $conversationDataBeforeUpdate['status'] ?? null,
                    $conditionValue,
                    'equals',
                ),
            'not_changed_from' => $this->statusChanged(
                $conversation,
                $conversationDataBeforeUpdate,
            ) &&
                $this->comparator->compare(
                    $conversationDataBeforeUpdate['status'] ?? null,
                    $conditionValue,
                    'not_equals',
                ),
            default => false,
        };
    }

    protected function statusChanged(
        Conversation $updatedTicket,
        array|null $conversationDataBeforeUpdate,
    ): bool
    {
        return !is_null($conversationDataBeforeUpdate) &&
            $this->comparator->compare(
                $updatedTicket->status,
                $conversationDataBeforeUpdate['status'],
                'not_equals',
            );
    }
}
