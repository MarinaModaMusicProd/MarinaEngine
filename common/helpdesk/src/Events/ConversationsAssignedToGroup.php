<?php

namespace Helpdesk\Events;

use Helpdesk\Models\Conversation;
use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class ConversationsAssignedToGroup implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Collection $conversations)
    {
        $this->dontBroadcastToCurrentUser();
    }

    public function broadcastOn(): array
    {
        return [new PresenceChannel(HelpDeskChannel::NAME)];
    }

    public function broadcastAs(): string
    {
        return HelpDeskChannel::EVENT_CONVERSATIONS_GROUP_CHANGED;
    }

    public function broadcastWith(): array
    {
        return [
            'event' => $this->broadcastAs(),
            'conversations' => $this->conversations->map(function (
                Conversation $conversation,
            ) {
                return [
                    'id' => $conversation->id,
                    'status' => $conversation->status,
                    'assigned_to' => $conversation->assigned_to,
                    'group_id' => $conversation->group_id,
                    'visitor_id' => $conversation->visitor_id,
                    'user_id' => $conversation->user_id,
                ];
            }),
        ];
    }
}
