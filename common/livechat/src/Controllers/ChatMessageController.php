<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Events\ChatMessageCreated;
use Livechat\Models\Chat;

class ChatMessageController extends BaseController
{
    public function store(Chat $chat)
    {
        $data = request()->validate([
            'body' => !count(request('fileEntryIds')) ? 'required|string' : '',
            'type' => 'string|in:note,event,message',
            'author' => 'string|in:visitor,agent,bot',
            'fileEntryIds' => 'required_without:body|array',
            'fileEntryIds.*' => 'int|exists:file_entries,id',
        ]);

        if ($chat->status === Chat::STATUS_CLOSED) {
            $chat->createVisitorStartedChatEvent();
        }

        $chatMessage = $chat->createMessage($data, [
            'status' => Chat::STATUS_OPEN,
        ]);

        event(new ChatMessageCreated($chat, $chatMessage));

        if ($data['author'] === 'visitor') {
            $chat->visitor->updateLastActiveDate();
        }

        return $this->success(['message' => $chatMessage]);
    }
}
