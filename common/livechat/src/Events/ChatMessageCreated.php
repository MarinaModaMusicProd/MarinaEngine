<?php

namespace Livechat\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Livechat\Models\Chat;
use Livechat\Models\ChatMessage;
use Livechat\Websockets\ChatVisitorChannel;

class ChatMessageCreated implements ShouldBroadcast
{
    use InteractsWithSockets;

    public function __construct(
        protected Chat $chat,
        protected ChatMessage $message,
    ) {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn()
    {
        return [new Channel(ChatVisitorChannel::NAME($this->chat->visitor_id))];
    }

    public function broadcastAs(): string
    {
        return ChatVisitorChannel::EVENT_MESSAGE_CREATED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'chatId' => $this->message->conversation_id,
        ];
    }
}
