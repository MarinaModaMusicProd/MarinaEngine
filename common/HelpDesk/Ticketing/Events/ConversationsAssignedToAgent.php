<?php

namespace Common\HelpDesk\Ticketing\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class ConversationsAssignedToAgent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Collection $conversations,
    ) {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('agents')];
    }

    public function broadcastAs(): string
    {
        return 'conversations.assigned';
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
        ];
    }
}
