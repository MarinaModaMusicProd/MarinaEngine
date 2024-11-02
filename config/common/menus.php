<?php

use Common\Channels\LoadChannelMenuItems;

return [
    [
        'name' => 'Channel',
        'type' => 'channel',
        'itemsLoader' => LoadChannelMenuItems::class,
    ],
];
