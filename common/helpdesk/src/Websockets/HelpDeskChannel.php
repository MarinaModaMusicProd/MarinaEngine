<?php

namespace Helpdesk\Websockets;

class HelpDeskChannel
{
    const NAME = 'helpdesk';

    const EVENT_CONVERSATIONS_CREATED = 'conversations.created';
    const EVENT_CONVERSATIONS_AGENT_CHANGED = 'conversations.agentChanged';
    const EVENT_CONVERSATIONS_GROUP_CHANGED = 'conversations.groupChanged';
    const EVENT_CONVERSATIONS_STATUS_CHANGED = 'conversations.statusChanged';
    const EVENT_CONVERSATIONS_NEW_MESSAGE = 'conversations.newMessage';
    const EVENT_AGENTS_UPDATED = 'agents.updated';
    const EVENT_VISITORS_CREATED = 'visitors.created';
    const EVENT_VISITORS_VISIT_CREATED = 'visitors.visitCreated';
}
