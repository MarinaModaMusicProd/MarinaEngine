<?php

namespace App\Services;

use Common\Channels\GenerateChannelsFromConfig;
use Illuminate\Support\Str;

class ChannelPresets
{
    public function getAll(): array
    {
        return [
            [
                'name' => 'Music streaming',
                'preset' => 'streaming',
                'description' =>
                    'Channel preset for a music streaming site similar to Spotify',
            ],
            [
                'name' => 'Music sharing',
                'preset' => 'sharing',
                'description' =>
                    'Channel preset for an music sharing site similar to SoundCloud',
            ],
        ];
    }

    public function apply(string $preset): void
    {
        $presetConfig = match ($preset) {
            'streaming' => resource_path(
                'defaults/channels/streaming-channels.json',
            ),
            default => resource_path(
                'defaults/channels/sharing-channels.json',
            ),
        };

        $homepageChannel = (new GenerateChannelsFromConfig())->execute([
            resource_path('defaults/channels/shared-channels.json'),
            $presetConfig,
        ]);

        if (Str::startsWith(settings('homepage.type'), 'channel')) {
            if ($homepageChannel) {
                settings()->save(['homepage.value' => $homepageChannel->id]);
            } else {
                settings()->save(['homepage.value' => null]);
            }
        }
    }
}
