<?php

namespace Helpdesk\Events;

use Helpdesk\Models\Conversation;
use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Conversation $conversation,
        public array $context,
    ) {
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
            'conversations' => [
                [
                    'id' => $this->conversation->id,
                    'status' => $this->conversation->status,
                    'assigned_to' => $this->conversation->assigned_to,
                    'visitor_id' => $this->conversation->visitor_id,
                    'user_id' => $this->conversation->user_id,
                ],
            ],
        ];
    }
}
