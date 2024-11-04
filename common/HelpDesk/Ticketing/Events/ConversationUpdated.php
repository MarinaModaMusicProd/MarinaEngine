<?php namespace Common\HelpDesk\Ticketing\Events;

use Common\HelpDesk\Ticketing\Models\Conversation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class ConversationUpdated implements ShouldQueue
{
    use SerializesModels;

    /**
     * Original (before it was updated) ticket model instance.
     */
    public array $originalTicket;

    public function __construct(
        public Conversation $updatedTicket,
        Conversation $originalTicket = null,
    ) {
        //convert Ticket model to array, otherwise there might be
        //issues with original ticket data being updated by eloquent
        $originalTicket = $originalTicket ?: $updatedTicket;
        $this->originalTicket = $originalTicket->toArray();
    }
}
