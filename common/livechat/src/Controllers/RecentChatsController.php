<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisitor;

class RecentChatsController extends BaseController
{
    public function __invoke(int $visitorId)
    {
        $this->authorize('index', Chat::class);

        $chats = ChatVisitor::findOrFail($visitorId)
            ->chats()
            ->with(['lastMessage'])
            ->get()
            ->map(function (Chat $chat) {
                $chat->lastMessage?->makeBodyCompact();
                return $chat;
            });

        return $this->success([
            'chats' => $chats,
        ]);
    }
}
