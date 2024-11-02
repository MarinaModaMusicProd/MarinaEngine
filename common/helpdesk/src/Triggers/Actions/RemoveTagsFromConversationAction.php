<?php namespace Helpdesk\Triggers\Actions;

use Common\Tags\Tag;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\Trigger;

class RemoveTagsFromConversationAction implements TriggerActionInterface
{
    public function execute(
        Conversation $conversation,
        array $action,
        Trigger $trigger,
    ): Conversation {
        $tagNames = $action['value']['tags_to_remove'];
        $tagNames = is_array($tagNames) ? $tagNames : explode(',', $tagNames);
        $tags = Tag::whereIn('name', $tagNames)->get();

        $conversation->tags()->detach($tags->pluck('id')->toArray());

        //'unload' tags relationship in case it was already loaded
        //on passed in ticket so removed tags are properly removed
        //the next time tags relationship is accessed on this ticket
        unset($conversation->tags);

        return $conversation;
    }
}
