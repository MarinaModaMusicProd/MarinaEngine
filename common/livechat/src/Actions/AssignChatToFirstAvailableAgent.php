<?php

namespace Livechat\Actions;

use Helpdesk\Actions\AssignConversationsToAgent;
use Helpdesk\Models\Group;
use Livechat\Models\Chat;

class AssignChatToFirstAvailableAgent
{
    public function execute(Chat $chat): Chat
    {
        $group = $chat->group ?? Group::findDefault();

        if ($group->chat_assignment_mode === 'manual') {
            $chat->update(['status' => Chat::STATUS_QUEUED]);
            return $chat;
        }

        $agents = (new AgentsLoader())
            ->getCurrentlyOnlineAgents()
            ->filter(
                fn($agent) => $agent['acceptsChats'] &&
                    $agent['groups']->contains('id', $group->id),
            );

        if ($agents->isNotEmpty()) {
            (new AssignConversationsToAgent())->execute(
                collect([$chat]),
                $agents->first()['id'],
                Chat::MODEL_TYPE,
            );
        } else {
            $chat->update(['status' => Chat::STATUS_QUEUED]);
        }

        return $chat;
    }
}
