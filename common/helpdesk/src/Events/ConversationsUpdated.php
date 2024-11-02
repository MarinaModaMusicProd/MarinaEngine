<?php namespace Helpdesk\Events;

use Illuminate\Support\Collection;

class ConversationsUpdated
{
    public array|Collection $conversationsDataBeforeUpdate = [];
    public array|Collection $conversationsAfterUpdate;

    public function __construct(array|Collection $conversationsBeforeUpdate)
    {

        $this->conversationsDataBeforeUpdate = [];
        foreach ($conversationsBeforeUpdate as $conversation) {
            $this->conversationsDataBeforeUpdate[$conversation->id] = [
                'id' => $conversation->id,
                'status' => $conversation->status,
                'assigned_to' => $conversation->assigned_to,
                'group_id' => $conversation->group_id,
                'closed_by' => $conversation->closed_by,
                'closed_at' => $conversation->closed_at,
                'visitor_id' => $conversation->visitor_id,
                'user_id' => $conversation->user_id,
                'updated_at' => $conversation->updated_at,
                'created_at' => $conversation->created_at,
            ];
        }
    }

    public function dispatch(array|Collection $conversations): void
    {
        $this->conversationsAfterUpdate = $conversations;
        event($this);
    }
}
