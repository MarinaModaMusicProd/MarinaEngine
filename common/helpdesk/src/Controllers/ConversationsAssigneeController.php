<?php namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\AssignConversationsToAgent;
use Helpdesk\Models\Conversation;

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
