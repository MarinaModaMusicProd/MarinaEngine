<?php

namespace Livechat\Events;

use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Livechat\Models\ChatVisitor;

class ChatVisitorCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public ChatVisitor $visitor)
    {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn()
    {
        return [new PresenceChannel(HelpDeskChannel::NAME)];
    }

    public function broadcastAs(): string
    {
        return HelpDeskChannel::EVENT_VISITORS_CREATED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'visitorId' => $this->visitor->id,
        ];
    }
}
