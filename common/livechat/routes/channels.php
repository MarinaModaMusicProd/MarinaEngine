<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

use App\Models\User;
use Helpdesk\Websockets\HelpDeskChannel;
use Livechat\Models\ChatVisitor;

Broadcast::channel(HelpDeskChannel::NAME, function (User|ChatVisitor $user) {
    if ($user instanceof ChatVisitor) {
        return [
            'id' => $user->id,
            'isAgent' => false,
        ];
    }
    return [
        'id' => $user->id,
        'isAgent' => $user->isAgent(),
    ];
}, ['guards' => ['web', 'livechatVisitor']]);
