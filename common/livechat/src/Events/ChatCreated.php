<?php

namespace Livechat\Events;

use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Livechat\Models\Chat;

class ChatCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Chat $chat)
    {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn(): array
    {
        return [new PresenceChannel(HelpDeskChannel::NAME)];
    }

    public function broadcastAs(): string
    {
        return HelpDeskChannel::EVENT_CONVERSATIONS_CREATED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'conversation' => [
                'id' => $this->chat->id,
                'status' => $this->chat->status,
                'assigned_to' => $this->chat->assigned_to,
                'visitor_id' => $this->chat->visitor_id,
                'user_id' => $this->chat->user_id,
            ],
        ];
    }
}
