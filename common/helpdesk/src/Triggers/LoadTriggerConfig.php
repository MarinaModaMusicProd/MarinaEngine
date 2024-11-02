<?php

namespace Helpdesk\Triggers;

use App\Models\Tag;
use App\Models\Ticket;
use App\Models\User;
use Common\Core\Values\ValueLists;
use Helpdesk\Models\Group;
use Illuminate\Support\Collection;
use Livechat\Models\Chat;

class LoadTriggerConfig
{
    public function execute(): array
    {
        $config = (new TriggersConfig())->get();
        $config['selectOptions'] = [
            'agent:id' => $this->agents(),
            'group:id' => Group::get()->map(
                fn($group) => [
                    'name' => $group->name,
                    'value' => $group->id,
                ],
            ),
            'conversation:status' => [
                ['name' => 'Open', 'value' => 'open'],
                ['name' => 'Closed', 'value' => 'closed'],
                ['name' => 'Pending/Idle', 'value' => 'pending'],
            ],
            'country:code' => array_map(
                fn($country) => [
                    'name' => $country['name'],
                    'value' => $country['code'],
                ],
                app(ValueLists::class)->countries(),
            ),
        ];

        if (class_exists(Chat::class)) {
            $config['selectOptions']['conversation:status'] = array_merge(
                $config['selectOptions']['conversation:status'],
                [
                    [
                        'name' => 'Queued (Chat only)',
                        'value' => Chat::STATUS_QUEUED,
                    ],
                    [
                        'name' => 'Unassigned (Chat only)',
                        'value' => Chat::STATUS_UNASSIGNED,
                    ],
                ],
            );
        }

        if (class_exists(Ticket::class)) {
            $config['selectOptions']['conversation:status'] = array_merge(
                $config['selectOptions']['conversation:status'],
                [
                    [
                        'name' => 'Locked (Ticket only)',
                        'value' => Ticket::STATUS_LOCKED,
                    ],
                    [
                        'name' => 'Spam (Ticket only)',
                        'value' => Ticket::STATUS_SPAM,
                    ],
                ],
            );
            $config['selectOptions']['ticket:category'] = Tag::where(
                'type',
                'category',
            )
                ->get()
                ->map(
                    fn($tag) => [
                        'name' => $tag->display_name,
                        'value' => $tag->name,
                    ],
                );
        }

        return $config;
    }

    protected function agents(): Collection
    {
        return User::whereAgent()
            ->limit(20)
            ->get()
            ->transform(
                fn($user) => [
                    'name' => $user->name,
                    'description' => $user->email,
                    'value' => $user->id,
                    'image' => $user->image,
                ],
            );
    }
}
