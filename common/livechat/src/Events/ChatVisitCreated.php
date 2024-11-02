<?php

namespace Livechat\Events;

use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Livechat\Models\ChatVisit;

class ChatVisitCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public ChatVisit $visit)
    {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn()
    {
        return [new PresenceChannel(HelpDeskChannel::NAME)];
    }

    public function broadcastAs(): string
    {
        return HelpDeskChannel::EVENT_VISITORS_VISIT_CREATED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'visitorId' => $this->visit->visitor_id,
        ];
    }
}
