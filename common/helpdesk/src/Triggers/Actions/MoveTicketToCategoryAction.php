<?php namespace Helpdesk\Triggers\Actions;

use App\Models\Ticket;
use Common\Tags\Tag;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;
use Illuminate\Support\Facades\DB;

class MoveTicketToCategoryAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        if ($conversation instanceof Ticket) {
            // remove other category tags
            $allCategories = Tag::where('type', 'category')->pluck('id');
            DB::table('taggables')->where('taggable_id', $conversation->id)
                ->where('taggable_type', Ticket::MODEL_TYPE)
                ->whereIn('tag_id', $allCategories)
                ->delete();

            $category = Tag::updateOrCreate([
                'name' => $action['value']['category_name'],
                'type' => 'category',
            ]);

            $conversation->attachTag($category['id']);

            //'unload' tags relationship in case it was already loaded
            //on passed in ticket so removed tags are properly removed
            //the next time tags relationship is accessed on this ticket
            unset($conversation->tags);
        }

        return $conversation;
    }
}
