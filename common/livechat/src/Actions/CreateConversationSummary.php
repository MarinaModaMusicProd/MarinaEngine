<?php

namespace Livechat\Actions;

use Livechat\Models\Chat;
use Livechat\Models\ConversationSummary;
use OpenAI;

class CreateConversationSummary
{
    const CONVERSATION_TOO_SHORT_CODE = 786;

    public function execute(Chat $chat): ConversationSummary
    {
        $messages = $chat
            ->messages()
            ->where('type', 'message')
            ->limit(30)
            ->latest()
            ->get()
            ->pluck('body')
            ->reverse()
            ->toJson();

        if (strlen($messages) < 500) {
            throw new \Exception(
                __('Conversation needs to be longer to generate a summary.'),
                self::CONVERSATION_TOO_SHORT_CODE,
            );
        }

        $client = OpenAI::client(config('services.openai.api_key'));

        $apiResponse = $client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'temperature' => 1,
            'response_format' => ['type' => 'json_object'],
            'messages' => [
                [
                    'role' => 'system',
                    'content' =>
                        'You are an assistant helping livechat agent summarize chat content.',
                ],
                [
                    'role' => 'user',
                    'content' => "Concisely summarize specified livechat content. Use bullet points. There should be at most 5 bullet points, less bullet points if possible, without losing content. Bullet points should not be numbered. Also generate 3 top keywords and overall customer sentiment. Format response as json using 'summary',  'keywords' and 'sentiment' keys: $messages",
                ],
            ],
        ]);

        $data = json_decode($apiResponse->choices[0]->message->content, true);

        $chat->summary()->delete();
        return $chat
            ->summary()
            ->create([
                'content' => $data,
                'generated_by' => auth()->id(),
            ])
            ->load('user');
    }
}
