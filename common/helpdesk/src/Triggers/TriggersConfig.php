<?php

namespace Helpdesk\Triggers;

use App\Models\Ticket;
use Livechat\Models\Chat;

class TriggersConfig
{
    protected static array $operators = [
        'contains' => [
            'label' => 'Contains',
            'type' => 'primitive',
        ],
        'not_contains' => [
            'label' => 'Does not contain',
            'type' => 'primitive',
        ],
        'starts_with' => [
            'label' => 'Starts with',
            'type' => 'primitive',
        ],
        'ends_with' => [
            'label' => 'Ends with',
            'type' => 'primitive',
        ],
        'equals' => [
            'label' => 'Equals',
            'type' => 'primitive',
        ],
        'not_equals' => [
            'label' => 'Does not equal',
            'type' => 'primitive',
        ],
        'matches_regex' => [
            'label' => 'Matches regex pattern',
            'type' => 'primitive',
        ],
        'more' => [
            'label' => 'More than',
            'type' => 'primitive',
        ],
        'less' => [
            'label' => 'Less than',
            'type' => 'primitive',
        ],
        'is' => [
            'label' => 'Is',
            'type' => 'primitive',
        ],
        'not' => [
            'label' => 'Is not',
            'type' => 'primitive',
        ],
        'changed' => [
            'label' => 'Changed',
            'type' => 'mixed',
        ],
        'changed_to' => [
            'label' => 'Changed to',
            'type' => 'mixed',
        ],
        'changed_from' => [
            'label' => 'Changed from',
            'type' => 'mixed',
        ],
        'not_changed' => [
            'label' => 'Not changed',
            'type' => 'mixed',
        ],
        'not_changed_to' => [
            'label' => 'Not changed to',
            'type' => 'mixed',
        ],
        'not_changed_from' => [
            'label' => 'Not changed from',
            'type' => 'mixed',
        ],
    ];

    public static array $conditions = [
        'event:type' => [
            'label' => 'Triggered when',
            'group' => 'filtering',
            'operators' => ['is'],
            'input_config' => [
                'type' => 'select',
                'select_options' => [
                    [
                        'name' => 'Conversation is created',
                        'value' => 'conversation_created',
                    ],
                    [
                        'name' => 'Conversation is updated',
                        'value' => 'conversation_updated',
                    ],
                ],
            ],
        ],
        'ticket:subject' => [
            'label' => 'Subject',
            'group' => 'ticket',
            'operators' => [
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
                'equals',
                'not_equals',
                'matches_regex',
            ],
            'input_config' => [
                'type' => 'text',
            ],
        ],
        'conversation:body' => [
            'label' => 'Content',
            'group' => 'conversation',
            'operators' => [
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
            ],
            'input_config' => [
                'type' => 'text',
            ],
        ],
        'conversation:status' => [
            'label' => 'Status',
            'group' => 'conversation',
            'operators' => [
                'is',
                'not',
                'changed',
                'changed_to',
                'changed_from',
                'not_changed',
                'not_changed_to',
                'not_changed_from',
            ],
            'input_config' => [
                'type' => 'select',
                'select_options' => 'conversation:status',
            ],
        ],
        'ticket:category' => [
            'label' => 'Category',
            'group' => 'ticket',
            'operators' => [
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
                'equals',
                'not_equals',
                'matches_regex',
                'is',
                'not',
            ],
            'input_config' => [
                'type' => 'select',
                'select_options' => 'ticket:category',
            ],
        ],
        'conversation:attachments' => [
            'label' => 'Number of attachments',
            'group' => 'conversation',
            'operators' => ['equals', 'not_equals', 'more', 'less'],
            'input_config' => [
                'type' => 'text',
                'input_type' => 'number',
            ],
        ],
        'conversation:assignee' => [
            'label' => 'Assignee',
            'group' => 'conversation',
            'operators' => [
                'is',
                'not',
                'changed',
                'changed_to',
                'changed_from',
                'not_changed',
                'not_changed_to',
                'not_changed_from',
            ],
            'input_config' => [
                'type' => 'select',
                'select_options' => 'agent:id',
            ],
        ],
        'ticket:mailboxAddress' => [
            'label' => 'Mailbox address',
            'group' => 'ticket',
            'operators' => [
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
                'equals',
                'not_equals',
                'matches_regex',
            ],
            'input_config' => [
                'type' => 'text',
            ],
        ],
        'customer:name' => [
            'label' => 'Customer name',
            'group' => 'customer',
            'operators' => [
                'is',
                'not',
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
                'equals',
                'not_equals',
                'matches_regex',
            ],
            'input_config' => [
                'type' => 'text',
            ],
        ],
        'customer:email' => [
            'label' => 'Customer email',
            'group' => 'customer',
            'operators' => [
                'is',
                'not',
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
                'equals',
                'not_equals',
                'matches_regex',
            ],
            'input_config' => [
                'type' => 'text',
            ],
        ],
        'visitor:visited_url' => [
            'label' => 'Visited URL',
            'group' => 'customer',
            'operators' => [
                'is',
                'not',
                'contains',
                'not_contains',
                'starts_with',
                'ends_with',
                'equals',
                'not_equals',
                'matches_regex',
            ],
            'input_config' => [
                'type' => 'text',
            ],
        ],
        'visitor:location' => [
            'label' => 'Location',
            'group' => 'customer',
            'operators' => ['is'],
            'input_config' => [
                'type' => 'select',
                'select_options' => 'country:code',
            ],
        ],
        'visitor:visits_count' => [
            'label' => 'Visits count',
            'group' => 'customer',
            'operators' => ['equals', 'not_equals', 'more', 'less'],
            'input_config' => [
                'type' => 'text',
                'input_type' => 'number',
            ],
        ],

        // time based
        'timeframe:hours_since_created' => [
            'label' => 'Hours since created',
            'group' => 'timeframe',
            'time_based' => true,
            'operators' => ['is', 'more', 'less'],
            'input_config' => [
                'type' => 'text',
                'input_type' => 'number',
            ],
        ],
        'timeframe:hours_since_closed' => [
            'label' => 'Hours since closed',
            'group' => 'timeframe',
            'time_based' => true,
            'operators' => ['is', 'more', 'less'],
            'input_config' => [
                'type' => 'text',
                'input_type' => 'number',
            ],
        ],
        'timeframe:hours_since_last_activity' => [
            'label' => 'Hours since last activity',
            'group' => 'timeframe',
            'time_based' => true,
            'operators' => ['is', 'more', 'less'],
            'input_config' => [
                'type' => 'text',
                'input_type' => 'number',
            ],
        ],
        'timeframe:hours_since_last_reply' => [
            'label' => 'Hours since last reply',
            'group' => 'timeframe',
            'time_based' => true,
            'operators' => ['is', 'more', 'less'],
            'input_config' => [
                'type' => 'text',
                'input_type' => 'number',
            ],
        ],
    ];

    protected static array $actions = [
        'send_email_to_user' => [
            'label' => 'Notify: via email',
            'updates_conversation' => false,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'select',
                        'name' => 'agent_id',
                        'select_options' => 'agent:id',
                    ],
                    [
                        'placeholder' => 'Subject',
                        'type' => 'text',
                        'name' => 'subject',
                    ],
                    [
                        'placeholder' => 'Email Message',
                        'type' => 'textarea',
                        'name' => 'message',
                    ],
                ],
            ],
        ],
        'add_note_to_conversation' => [
            'label' => 'Conversation: add a note',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'textarea',
                        'placeholder' => 'Note Text',
                        'name' => 'note_text',
                    ],
                ],
            ],
        ],
        'change_conversation_status' => [
            'label' => 'Conversation: change status',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'select',
                        'default_value' => 'open',
                        'select_options' => 'conversation:status',
                        'name' => 'status_name',
                    ],
                ],
            ],
        ],
        'assign_conversation_to_agent' => [
            'label' => 'Conversation: assign to agent',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'select',
                        'select_options' => 'agent:id',
                        'name' => 'agent_id',
                    ],
                ],
            ],
        ],
        'transfer_conversation_to_group' => [
            'label' => 'Conversation: transfer to group',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'select',
                        'select_options' => 'group:id',
                        'name' => 'group_id',
                    ],
                ],
            ],
        ],
        'add_tags_to_conversation' => [
            'label' => 'Conversation: add tag(s)',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'text',
                        'placeholder' => 'Enter tag name...',
                        'default_value' => [],
                        'name' => 'tags_to_add',
                    ],
                ],
            ],
        ],
        'remove_tags_from_conversation' => [
            'label' => 'Conversation: remove tag(s)',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'text',
                        'placeholder' => 'Enter tag name... tags with comma',
                        'default_value' => [],
                        'name' => 'tags_to_remove',
                    ],
                ],
            ],
        ],
        'move_ticket_to_category' => [
            'label' => 'Ticket: move to Category',
            'updates_conversation' => true,
            'aborts_cycle' => false,
            'input_config' => [
                'inputs' => [
                    [
                        'type' => 'select',
                        'select_options' => 'ticket:category',
                        'name' => 'category_name',
                    ],
                ],
            ],
        ],
        'delete_conversation' => [
            'label' => 'Conversation: delete',
            'updates_conversation' => true,
            'aborts_cycle' => true,
        ],
    ];

    public function get(): array
    {
        $haveTickets = class_exists(Ticket::class);
        $haveChats = class_exists(Chat::class);

        $data = [
            'operators' => self::$operators,
            'conditions' => array_filter(
                self::$conditions,
                function ($name) use ($haveTickets, $haveChats) {
                    return (!str_contains($name, 'ticket') || $haveTickets) &&
                        (!str_contains($name, 'visitor') || $haveChats);
                },
                ARRAY_FILTER_USE_KEY,
            ),
            'actions' => array_filter(
                self::$actions,
                function ($name) use ($haveTickets, $haveChats) {
                    return (!str_contains($name, 'ticket') || $haveTickets) &&
                        (!str_contains($name, 'visitor') || $haveChats);
                },
                ARRAY_FILTER_USE_KEY,
            ),
        ];

        if ($haveChats && $haveTickets) {
            $data['conditions']['conversation:type'] = [
                'label' => 'Conversation type',
                'group' => 'filtering',
                'operators' => ['is'],
                'input_config' => [
                    'type' => 'select',
                    'select_options' => [
                        [
                            'name' => 'Chat',
                            'value' => 'Chat',
                        ],
                        [
                            'name' => 'Ticket',
                            'value' => 'Ticket',
                        ],
                    ],
                ],
            ];
        }

        return $data;
    }
}
