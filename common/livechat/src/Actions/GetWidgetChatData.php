<?php

namespace Livechat\Actions;

use Livechat\Models\Chat;

class GetWidgetChatData
{
    public function execute(Chat $chat): array
    {
        $data = [
            'chat' => $chat,
            'messages' => (new PaginateChatMessages())->execute([
                'chatId' => $chat->id,
            ]),
        ];

        if ($chat->status === Chat::STATUS_QUEUED) {
            $data['queuedChatInfo'] = $this->getQueuedChatInfo($chat->id);
        }

        return $data;
    }

    protected function getQueuedChatInfo(int $chatId): array
    {
        $allQueuedChats = Chat::where('status', Chat::STATUS_QUEUED)->pluck(
            'id',
        );

        $waitTimePerChat = 5;
        $index = $allQueuedChats->search($chatId);

        return [
            'estimatedWaitTime' =>
                $index === 0 ? $waitTimePerChat : $waitTimePerChat * $index,
            'positionInQueue' => $index + 1,
        ];
    }
}
