<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Actions\CreateConversationSummary;
use Livechat\Models\Chat;

class ChatSummaryController extends BaseController
{
    public function show(int $chatId)
    {
        $chat = Chat::with('user')->findOrFail($chatId);

        $this->authorize('show', $chat);

        $summary = $chat
            ->summary()
            ->with('user')
            ->first();

        return $this->success(['summary' => $summary]);
    }

    public function destroy(int $chatId)
    {
        $chat = Chat::findOrFail($chatId);

        $this->authorize('update', $chat);

        $chat->summary()->delete();

        return $this->success();
    }

    public function generate(int $chatId)
    {
        $chat = Chat::findOrFail($chatId);

        $this->authorize('update', $chat);

        try {
            $summary = (new CreateConversationSummary())->execute($chat);
        } catch (\Exception $e) {
            if (
                $e->getCode() ===
                CreateConversationSummary::CONVERSATION_TOO_SHORT_CODE
            ) {
                return $this->error($e->getMessage());
            } else {
                throw $e;
            }
        }

        return $this->success([
            'summary' => $summary,
        ]);
    }
}
