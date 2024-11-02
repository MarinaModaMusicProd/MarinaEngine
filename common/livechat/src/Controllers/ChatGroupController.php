<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\AssignConversationsToGroup;
use Helpdesk\Models\Group;
use Livechat\Actions\CommonChatTransferActions;
use Livechat\Actions\DistributeActiveChatsToAvailableAgents;
use Livechat\Models\Chat;

class ChatGroupController extends BaseController
{
    public function update()
    {
        $this->authorize('update', Chat::class);

        $data = $this->validate(request(), [
            'chatIds' => 'required|array|min:1',
            'chatIds.*' => 'required|integer',
            'groupId' => 'required|integer',
            'privateNote' => 'nullable|string',
            'shouldSummarize' => 'nullable|boolean',
        ]);

        $chats = Chat::whereIn('id', $data['chatIds'])->get();

        (new CommonChatTransferActions())->execute($chats, $data);

        // add event if chat group changed
        $groups = Group::all();
        $chats->each(function (Chat $chat) use ($data, $groups) {
            if ($chat->group_id && $chat->group_id !== $data['groupId']) {
                $chat->createGroupChangedEvent(
                    $groups->firstWhere('id', $data['groupId']),
                );
            }
        });

        (new AssignConversationsToGroup())->execute(
            $chats,
            $data['groupId'],
            Chat::MODEL_TYPE,
        );

        // assign chat to first available agent, if needed
        (new DistributeActiveChatsToAvailableAgents())->execute();

        return $this->success();
    }
}
