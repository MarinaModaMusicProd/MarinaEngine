<?php namespace Helpdesk\Triggers\Conditions;

use Helpdesk\Models\Conversation;

abstract class BaseCondition
{
    public function __construct(protected PrimitiveValuesComparator $comparator)
    {
    }

    abstract public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool;
}
