<?php

namespace Helpdesk\Triggers\Conditions\Timeframe;

use Carbon\Carbon;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\ConversationItem;
use Helpdesk\Triggers\Conditions\BaseCondition;

class TimeframeHoursSinceLastReplyCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        $lastReply = ConversationItem::find($conversation->last_message_id);
        $hours = (int) $conditionValue;
        return $lastReply?->created_at->lte(
            Carbon::now()->subHours($hours),
        );
    }
}
