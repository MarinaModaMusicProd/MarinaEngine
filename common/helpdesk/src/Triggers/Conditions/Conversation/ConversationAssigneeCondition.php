<?php namespace Helpdesk\Triggers\Conditions\Conversation;

use App\Models\User;
use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;
use Illuminate\Support\Str;

class ConversationAssigneeCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        $methodName = 'assignee' . ucfirst(Str::camel($operatorName));

        // if conditionValue is email, fetch matching user ID
        if (is_string($conditionValue) && Str::contains($conditionValue, '@')) {
            $user = app(User::class)
                ->where('email', $conditionValue)
                ->first();
            $conditionValue = $user ? $user->id : null;
        }

        //cast conditionValue to integer, unless it's falsy,
        //null for example means ticket is unassigned currently
        $conditionValue = $conditionValue
            ? (int) $conditionValue
            : $conditionValue;

        return $this->$methodName(
            $conversation,
            $conversationDataBeforeUpdate,
            $conditionValue,
        );
    }
    protected function assigneeIs(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        mixed $conditionValue,
    ): bool {
        return $this->comparator->compare(
            $conversation->assigned_to,
            $conditionValue,
            'equals',
        );
    }

    protected function assigneeNot(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        mixed $conditionValue,
    ): bool {
        return !$this->assigneeIs(
            $conversation,
            $conversationDataBeforeUpdate,
            $conditionValue,
        );
    }

    protected function assigneeChanged(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
    ): bool {
        return $this->comparator->compare(
            $conversation->assigned_to,
            $conversationDataBeforeUpdate['assigned_to'] ?? null,
            'not_equals',
        );
    }

    protected function assigneeNotChanged(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
    ): bool {
        return !$this->assigneeChanged(
            $conversation,
            $conversationDataBeforeUpdate,
        );
    }

    protected function assigneeChangedTo(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        mixed $conditionValue,
    ): bool {
        return $this->assigneeChanged(
            $conversation,
            $conversationDataBeforeUpdate,
        ) &&
            $this->comparator->compare(
                $conversation->assigned_to,
                $conditionValue,
                'equals',
            );
    }

    protected function assigneeChangedFrom(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        mixed $conditionValue,
    ): bool {
        return $this->assigneeChanged(
            $conversation,
            $conversationDataBeforeUpdate,
        ) &&
            $this->comparator->compare(
                $conversationDataBeforeUpdate['assigned_to'] ?? null,
                $conditionValue,
                'equals',
            );
    }

    protected function assigneeNotChangedTo(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        mixed $conditionValue,
    ): bool {
        return $this->assigneeChanged(
            $conversation,
            $conversationDataBeforeUpdate,
        ) &&
            $this->comparator->compare(
                $conversation->assigned_to,
                $conditionValue,
                'not_equals',
            );
    }

    protected function assigneeNotChangedFrom(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        mixed $conditionValue,
    ): bool
    {
        return $this->assigneeChanged($conversation, $conversationDataBeforeUpdate) &&
            $this->comparator->compare(
                $conversationDataBeforeUpdate['assigned_to'],
                $conditionValue,
                'not_equals',
            );
    }
}
