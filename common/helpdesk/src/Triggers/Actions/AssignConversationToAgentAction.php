<?php namespace Helpdesk\Triggers\Actions;

use App\Models\Ticket;
use Helpdesk\Actions\AssignConversationsToAgent;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

class AssignConversationToAgentAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Ticket {
        $agentId = $action['value']['agent_id'];
        return (new AssignConversationsToAgent())
            ->execute([$conversation->id], $agentId, $conversation->model_type)
            ->first();
    }
}
