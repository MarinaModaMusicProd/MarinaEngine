<?php namespace Helpdesk\Triggers\Actions;

use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

interface TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation;
}
