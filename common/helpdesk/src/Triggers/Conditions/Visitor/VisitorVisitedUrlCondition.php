<?php namespace Helpdesk\Triggers\Conditions\Visitor;

use Helpdesk\Models\Conversation;
use Helpdesk\Triggers\Conditions\BaseCondition;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisit;

class VisitorVisitedUrlCondition extends BaseCondition
{
    public function isMet(
        Conversation $conversation,
        array|null $conversationDataBeforeUpdate,
        string $operatorName,
        mixed $conditionValue,
    ): bool {
        if (class_exists(ChatVisit::class) && $conversation instanceof Chat) {
            $urls = ChatVisit::where('visitor_id', $conversation->visitor_id)
                ->limit(50)
                ->get()
                ->map(fn($visit) => $visit->url);

            return $urls->some(
                fn($url) => $this->comparator->compare(
                    $url,
                    $conditionValue,
                    $operatorName,
                ),
            );
        }

        return false;
    }
}
