<?php

namespace Helpdesk\Triggers\Conditions\Timeframe;

use Carbon\Carbon;
use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;

class TimeframeHoursSinceCreatedCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        $hours = (int) $conditionValue;
        return $conversation->created_at->lte(Carbon::now()->subHours($hours));
    }
}
