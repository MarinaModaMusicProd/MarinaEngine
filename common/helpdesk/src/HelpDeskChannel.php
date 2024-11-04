<?php

namespace Helpdesk;

class HelpDeskChannel
{
    const NAME = 'helpdesk';

    const EVENT_CONVERSATIONS_CREATED = 'conversations.created';
    const EVENT_CONVERSATIONS_ASSIGNED = 'conversations.assigned';
    const EVENT_CONVERSATIONS_STATUS_CHANGED = 'conversations.statusChanged';
    const EVENT_AGENTS_UPDATED = 'agents.updated';
}
