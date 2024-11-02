<?php

namespace Livechat\Actions;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Livechat\Models\Chat;

class CommonChatTransferActions
{
    public function execute(Collection $chats, array $data): void
    {
        // add private note before adding transfer event
        if (isset($data['privateNote'])) {
            $chats->each(
                fn(Chat $chat) => $chat->createMessage([
                    'body' => $data['privateNote'],
                    'type' => 'note',
                    'author' => 'agent',
                ]),
            );
        }

        if (Arr::get($data, 'shouldSummarize')) {
            $chats->each(function (Chat $chat) {
                try {
                    (new CreateConversationSummary())->execute($chat);
                } catch (\Exception $e) {
                    if (
                        $e->getCode() !==
                        CreateConversationSummary::CONVERSATION_TOO_SHORT_CODE
                    ) {
                        throw $e;
                    }
                }
            });
        }
    }
}
