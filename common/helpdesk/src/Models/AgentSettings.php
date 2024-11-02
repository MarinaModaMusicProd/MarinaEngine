<?php

namespace Helpdesk\Models;

use Illuminate\Database\Eloquent\Model;

class AgentSettings extends Model
{
    public $timestamps = false;

    protected $guarded = ['id'];

    protected $casts = [
        'chat_limit' => 'integer',
        'working_hours' => 'json',
        'accepts_chats' => 'string',
        'user_id' => 'integer',
    ];

    public static function newFromDefault(): static
    {
        return new static([
            'chat_limit' => 6,
            'accepts_chats' => 'yes',
            'working_hours' => null,
        ]);
    }
}
