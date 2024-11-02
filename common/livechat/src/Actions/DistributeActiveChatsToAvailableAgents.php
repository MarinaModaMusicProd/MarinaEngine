<?php

namespace Livechat\Actions;

use Livechat\Models\Chat;

class DistributeActiveChatsToAvailableAgents
{
    public function execute(): void
    {
        $chatsWaitingForAgent = Chat::whereIn('status', [
            Chat::STATUS_OPEN,
            Chat::STATUS_IDLE,
            Chat::STATUS_QUEUED,
        ])
            ->whereNull('assigned_to')
            ->with('group')
            ->limit(10)
            ->get();

        $chatsWaitingForAgent->each(function (Chat $chat) {
            (new AssignChatToFirstAvailableAgent())->execute($chat);
        });
    }
}
