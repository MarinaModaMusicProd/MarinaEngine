<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Events\ConversationStatusChanged;
use Livechat\Actions\DistributeActiveChatsToAvailableAgents;
use Livechat\Models\Chat;

class ChatStatusController extends BaseController
{
    public function update(int $chatId)
    {
        $chat = Chat::findOrFail($chatId);

        $this->authorize('update', $chat);

        $data = request()->validate([
            'status' => 'required|in:active,closed',
        ]);

        $chat->update([
            'status' => $data['status'],
        ]);

        if ($data['status'] === Chat::STATUS_CLOSED) {
            $chat->createClosedByAgentEvent(auth()->user());

            // if chat is closed, run chat distribution cycle
            (new DistributeActiveChatsToAvailableAgents())->execute();
        }

        event(new ConversationStatusChanged(collect([$chat])));

        return $this->success();
    }
}
