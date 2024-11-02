<?php

namespace Helpdesk\Events;

use App\Models\User;
use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AgentUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $user)
    {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn(): array
    {
        return [new PresenceChannel(HelpDeskChannel::NAME)];
    }

    public function broadcastAs(): string
    {
        return HelpDeskChannel::EVENT_AGENTS_UPDATED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'agentId' => $this->user->id,
        ];
    }
}
