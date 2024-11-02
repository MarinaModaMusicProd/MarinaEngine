<?php

namespace Common\Websockets\API;

use Illuminate\Support\Collection;

class ReverbAPI extends WebsocketProviderAPI
{
    public function getAllChannels(): Collection
    {
        $appId = config('broadcasting.connections.reverb.app_id');
        $response = $this->makeReverbRequest("apps/$appId/channels");
        return collect($response['channels'] ?? []);
    }

    public function getActiveUsersInChannel(string $channel): Collection
    {
        $appId = config('broadcasting.connections.reverb.app_id');
        $response = $this->makeReverbRequest(
            "apps/$appId/channels/presence-$channel/users",
        );

        return collect($response['users'] ?? [])->map(
            fn($user) => ctype_digit($user['id'])
                ? (int) $user['id']
                : $user['id'],
        );
    }

    protected function makeReverbRequest(string $path)
    {
        $scheme = config('broadcasting.connections.reverb.options.scheme');
        $host = config('broadcasting.connections.reverb.options.host');
        $port = config('broadcasting.connections.reverb.options.port');
        return $this->makeRequestWithCaching("$scheme://$host:$port/$path");
    }
}
