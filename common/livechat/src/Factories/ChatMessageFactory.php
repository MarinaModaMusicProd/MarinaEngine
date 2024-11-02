<?php

namespace Livechat\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Livechat\Models\Chat;
use Livechat\Models\ChatMessage;

class ChatMessageFactory extends Factory
{
    protected $model = ChatMessage::class;

    public function event(): Factory
    {
        return $this->state(function (array $attributes, Chat $chat) {
            $name = $attributes['body'];
            $body = ['name' => $attributes['body']];
            if ($name === Chat::EVENT_VISITOR_LEFT_CHAT) {
                $body['status'] = $chat->status;
            } elseif ($name === Chat::EVENT_AGENT_LEFT_CHAT) {
                $body['oldAgentId'] = $chat->agent_id;
            }
            return [
                'author' => 'system',
                'type' => 'event',
                'body' => fn() => ['name' => $attributes['body']],
            ];
        });
    }

    public function definition(): array
    {
        return [
            'type' => 'message',
        ];
    }
}
