<?php namespace Common\HelpDesk\Ticketing\Controllers;

use Common\Core\BaseController;
use Common\HelpDesk\Ticketing\Actions\AssignConversationsToAgent;
use Common\HelpDesk\Ticketing\Models\Conversation;

class ConversationsAssigneeController extends BaseController
{
    public function change()
    {
        $this->authorize('update', Conversation::class);

        $data = $this->validate(request(), [
            'conversationIds' => 'required|array|min:1',
            'conversationIds.*' => 'required|integer',
            'userId' => 'required|integer',
            'modelType' => 'required|string',
        ]);

        (new AssignConversationsToAgent())->execute(
            $data['conversationIds'],
            $data['userId'],
            $data['modelType'],
        );

        return $this->success();
    }
}
