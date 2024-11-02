<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\AssignConversationsToAgent;
use Helpdesk\Events\ConversationStatusChanged;
use Livechat\Actions\AgentsLoader;
use Livechat\Actions\CommonChatTransferActions;
use Livechat\Models\Chat;

class ChatAssigneeController extends BaseController
{
    public function update()
    {
        $this->authorize('update', Chat::class);

        $data = $this->validate(request(), [
            'chatIds' => 'required|array|min:1',
            'chatIds.*' => 'required|integer',
            'userId' => 'required|integer',
            'privateNote' => 'nullable|string',
            'shouldSummarize' => 'nullable|boolean',
        ]);

        $chats = Chat::whereIn('id', $data['chatIds'])->get();

        // change status before assigning to agent so ConversationUpdated
        // event is fired only once after both changes are made
        $chatsThatNeedStatusChange = $chats->filter(
            fn($chat) => $chat->status !== Chat::STATUS_OPEN &&
                $chat->status !== Chat::STATUS_IDLE,
        );
        if ($chatsThatNeedStatusChange->isNotEmpty()) {
            Chat::whereIn(
                'id',
                $chatsThatNeedStatusChange->pluck('id'),
            )->update(['status' => Chat::STATUS_OPEN]);
            event(new ConversationStatusChanged($chatsThatNeedStatusChange));
        }

        (new CommonChatTransferActions())->execute($chats, $data);

        // add event if chat was assigned to another agent
        $agents = (new AgentsLoader())->getAllAgents();
        $chats->each(function (Chat $chat) use ($data, $agents) {
            if ($chat->assigned_to && $chat->assigned_to !== $data['userId']) {
                $chat->createAgentChangedEvent(
                    $agents->firstWhere('id', $data['userId']),
                );
            }
        });

        (new AssignConversationsToAgent())->execute(
            $chats,
            $data['userId'],
            Chat::MODEL_TYPE,
        );

        return $this->success();
    }
}
