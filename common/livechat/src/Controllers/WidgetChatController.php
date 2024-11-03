<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\AssignConversationsToAgent;
use Helpdesk\Models\Group;
use Illuminate\Support\Facades\Auth;
use Livechat\Actions\AssignChatToFirstAvailableAgent;
use Livechat\Actions\GetWidgetChatData;
use Livechat\Events\ChatCreated;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisitor;

class WidgetChatController extends BaseController
{
    public function index()
    {
        $visitor = ChatVisitor::getOrCreateForCurrentRequest();

        $chats = $visitor
            ->chats()
            ->with([
                'lastMessage.user',
                'assignee',
                'visitor' => fn($q) => $q->compact(),
            ])
            ->latest()
            ->limit(20)
            ->get()
            ->makeUsersCompact();

        return $this->success(['conversations' => $chats]);
    }

    public function show(int $chatId)
    {
        $chat = Chat::findOrFail($chatId);

        return $this->success((new GetWidgetChatData())->execute($chat));
    }

    public function store()
    {
        $data = request()->validate([
            'content' => 'array|min:1',
            'content.*.author' => 'required|string',
            'content.*.body' =>
                'required_without:content.*.fileEntryIds|string',
            'content.*.fileEntryIds' => 'required_without:content.*.body|array',
            'content.*.fileEntryIds.*' => 'int|exists:file_entries,id',
            'agentId' => 'nullable|int',
        ]);

        if (isset($data['agentId']) && !Auth::user()->isAgent()) {
            return $this->error(
                'Only agents can assign chats to other agents.',
                [],
                403,
            );
        }

        $visitor = ChatVisitor::getOrCreateForCurrentRequest();
        $chat = $visitor->chats()->create(['status' => Chat::STATUS_ACTIVE]);

        // assign visits that have not been attached to another chat yet
        $visitor
            ->visits()
            ->whereNull('chat_id')
            ->update(['chat_id' => $chat->id]);

        $chat->update([
            // todo: might need to change this after assigning to group via triggers is implemented
            'group_id' => Group::findDefault()?->id,
        ]);

        if (isset($data['agentId'])) {
            (new AssignConversationsToAgent())->execute(
                collect([$chat]),
                $data['agentId'],
                Chat::MODEL_TYPE,
            );
        } else {
            (new AssignChatToFirstAvailableAgent())->execute($chat);
        }

        foreach ($data['content'] as $msg) {
            if ($msg['author'] === 'agent') {
                $msg['user_id'] = $chat->assignee?->id;
            }
            $chat->createMessage($msg);
        }

        ChatCreated::dispatch($chat);

        return $this->success([
            'chat' => $chat,
        ]);
    }
}
