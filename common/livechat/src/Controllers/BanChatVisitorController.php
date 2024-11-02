<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Helpdesk\Events\ConversationsUpdated;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisitor;

class BanChatVisitorController extends BaseController
{
    public function store(int $id)
    {
        $visitor = ChatVisitor::findOrFail($id);

        $data = $this->validate(request(), [
            'ban_until' => 'nullable|date|after:now',
            'comment' => 'nullable|string|max:255',
            'permanent' => 'boolean',
        ]);

        $this->authorize('destroy', [$visitor::class, [$visitor->id]]);

        $chats = $visitor->chats()->get();
        $updatedEvent = new ConversationsUpdated($chats);

        $visitor->createBan($data);
        Chat::changeStatus('closed', $chats);

        $updatedEvent->dispatch($chats);

        return $this->success(['visitor' => $visitor]);
    }

    public function destroy(int $id)
    {
        $visitor = ChatVisitor::findOrFail($id);

        $this->authorize('destroy', [$visitor::class, [$visitor->id]]);

        $visitor->unban();

        return $this->success(['visitor' => $visitor]);
    }
}
