<?php

namespace Livechat\Actions;

use Common\Database\Datasource\Datasource;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Arr;
use Livechat\Models\ChatMessage;

class PaginateChatMessages
{
    public function execute(array $params): AbstractPaginator
    {
        $chatId = Arr::get($params, 'chatId');
        $params['paginate'] = 'simple';

        $datasource = new Datasource(
            ChatMessage::query()
                ->when($chatId, fn($q) => $q->where('conversation_id', $chatId))
                ->with(['attachments', 'user'])
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc'),
            $params,
        );
        $datasource->order = false;

        $pagination = $datasource->paginate();

        $pagination->setCollection(
            $pagination
                ->getCollection()
                ->makeUsersCompact()
                ->reverse()
                ->values(),
        );

        return $pagination;
    }
}
