<?php

namespace App\Actions\Channel;

use App\Channel;

class LoadChannelMenuItems
{
    public function execute()
    {
        return app(Channel::class)->limit(20)->get()
            ->map(function(Channel $channel) {
                return [
                    'label' => $channel->name,
                    'action' => $channel->slug,
                    'type' => 'route',
                    'model_id' => $channel->id,
                    'id' => $channel->id,
                ];
            });
    }
}
