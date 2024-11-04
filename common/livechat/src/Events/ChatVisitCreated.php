<?php

namespace Livechat\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Livechat\Models\ChatVisit;
use Livechat\Websockets\ChatVisitorChannel;

class ChatVisitCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public ChatVisit $visit)
    {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn()
    {
        return [
            new Channel(ChatVisitorChannel::NAME($this->visit->visitor_id)),
        ];
    }

    public function broadcastAs(): string
    {
        return ChatVisitorChannel::EVENT_VISIT_CREATED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'visitorId' => $this->visit->visitor_id,
        ];
    }
}
