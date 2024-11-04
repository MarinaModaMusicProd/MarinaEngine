<?php

namespace Livechat\Websockets;

class ChatVisitorChannel
{
    public static function NAME(string $visitorId): string
    {
        return "visitor.{$visitorId}";
    }

    const EVENT_VISIT_CREATED = 'visit.created';
    const EVENT_MESSAGE_CREATED = 'message.created';
}
