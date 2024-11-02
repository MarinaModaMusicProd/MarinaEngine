<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\AssignConversationsToAgent;
use Helpdesk\Events\ConversationCreated;
use Helpdesk\Models\Group;
use Illuminate\Support\Facades\Auth;
use Livechat\Actions\AssignChatToFirstAvailableAgent;
use Livechat\Actions\GetWidgetChatData;
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
            'preChatForm' => 'array|nullable',
            'agentId' => 'nullable|int',
            'visitorId' => 'nullable|int',
        ]);

        if (
            (isset($data['agentId']) || isset($data['visitorId'])) &&
            !Auth::user()->isAgent()
        ) {
            return $this->error(
                __('Only agents can re-assign chats.'),
                [],
                403,
            );
        }

        // group selected by customer in pre-chat form
        if (isset($data['preChatForm'])) {
            $selectedGroupId = collect($data['preChatForm'])->firstWhere(
                'name',
                'group',
            )['value'];
        }

        $visitor = isset($data['visitorId'])
            ? ChatVisitor::findOrFail($data['visitorId'])
            : ChatVisitor::getOrCreateForCurrentRequest();
        $chat = $visitor->chats()->create([
            'status' => Chat::STATUS_OPEN,
            'group_id' => $selectedGroupId ?? Group::findDefault()?->id,
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

        if (isset($data['preChatForm'])) {
            $chat->storePreChatFormData($data['preChatForm']);
        }

        if (isset($data['content'])) {
            foreach ($data['content'] as $msg) {
                if ($msg['author'] === 'agent') {
                    $msg['user_id'] = $chat->assignee?->id;
                }
                $chat->createMessage($msg);
            }
        }

        ConversationCreated::dispatch($chat, [
            'createdByAgent' => Auth::user()?->isAgent(),
            'url' => request()->header('referer'),
        ]);

        return $this->success([
            'chat' => $chat,
        ]);
    }
}
