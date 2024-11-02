<?php

namespace Livechat\Models;

use Helpdesk\Models\ConversationItem;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Livechat\Factories\ChatMessageFactory;

class ChatMessage extends ConversationItem
{
    use HasFactory;

    const MODEL_TYPE = 'chatMessage';

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'conversation_id');
    }

    public function makeBodyCompact(int $length = 120): static
    {
        if ($this->body) {
            $this->body = strip_tags($this->body);
            $this->body = str_replace("\n", ' ', $this->body);
            $this->body = Str::limit($this->body, $length);
        }

        return $this;
    }

    protected function body(): Attribute
    {
        return Attribute::make(
            get: function (string|null $value) {
                if (
                    $value &&
                    ($this->type === 'event' ||
                        $this->type === 'preChatFormData')
                ) {
                    return json_decode($value, true);
                }
                return $value;
            },
            set: function ($value) {
                if (is_array($value)) {
                    return json_encode($value);
                }
                return $value;
            },
        );
    }

    protected static function newFactory(): Factory
    {
        return ChatMessageFactory::new();
    }
}
