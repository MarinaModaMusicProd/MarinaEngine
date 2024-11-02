<?php

namespace Livechat\Models;

use Helpdesk\Models\HcTag;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class ChatTag extends HcTag
{
    protected $table = 'tags';

    public function chats(): MorphToMany
    {
        return $this->morphedByMany(Chat::class, 'taggable')->where(
            'conversations.type',
            Chat::MODEL_TYPE,
        );
    }
}
