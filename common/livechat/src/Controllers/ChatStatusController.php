<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Events\ConversationsUpdated;
use Livechat\Models\Chat;

class ChatStatusController extends BaseController
{
    public function update(int $chatId)
    {
        $chat = Chat::findOrFail($chatId);

        $this->authorize('update', $chat);

        $updatedEvent = new ConversationsUpdated([$chat]);

        $data = request()->validate([
            'status' => 'required|in:active,closed',
        ]);

        Chat::changeStatus($data['status'], [$chat]);

        $updatedEvent->dispatch([$chat]);

        return $this->success();
    }
}
