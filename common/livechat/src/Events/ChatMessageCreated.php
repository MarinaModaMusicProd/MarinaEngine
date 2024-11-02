<?php

namespace Livechat\Events;

use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Livechat\Models\Chat;
use Livechat\Models\ChatMessage;

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
        return [new PresenceChannel(HelpDeskChannel::NAME)];
    }

    public function broadcastAs(): string
    {
        return HelpDeskChannel::EVENT_CONVERSATIONS_NEW_MESSAGE;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'type' => $this->message->type,
            'chatId' => $this->message->conversation_id,
            'messageId' => $this->message->id,
            'conversations' => [
                [
                    'id' => $this->chat->id,
                    'status' => $this->chat->status,
                    'assigned_to' => $this->chat->assigned_to,
                    'visitor_id' => $this->chat->visitor_id,
                    'user_id' => $this->chat->user_id,
                ],
            ],
        ];
    }
}
