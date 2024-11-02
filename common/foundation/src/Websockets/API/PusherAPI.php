<?php

namespace Common\Websockets\API;

use Illuminate\Support\Collection;

class PusherAPI extends WebsocketProviderAPI
{
    public function getAllChannels(): Collection
    {
        $appId = config('broadcasting.connections.pusher.id');
        $response = $this->makePusherRequest("apps/$appId/channels");
        return collect($response['channels'] ?? []);
    }

    public function getActiveUsersInChannel(string $channel): Collection
    {
        $appId = config('broadcasting.connections.pusher.id');
        $response = $this->makePusherRequest(
            "apps/$appId/channels/presence-$channel/users",
        );

        return collect($response['users'] ?? [])->map(
            fn($user) => ctype_digit($user['id'])
                ? (int) $user['id']
                : $user['id'],
        );
    }

    protected function makePusherRequest(string $path)
    {
        $cluster = config('broadcasting.connections.pusher.options.cluster');
        $method = 'GET';
        $params = [];
        $params['auth_key'] = config('services.pusher.key');
        $params['auth_timestamp'] = time();
        $params['auth_version'] = '1.0';

        $params = array_merge($params, []);
        ksort($params);

        $string_to_sign =
            "$method\n" .
            "/$path" .
            "\n" .
            $this->arrayImplode('=', '&', $params);

        $params['auth_signature'] = hash_hmac(
            'sha256',
            $string_to_sign,
            config('services.pusher.secret'),
            false,
        );

        return $this->makeRequestWithCaching(
            "https://api-$cluster.pusher.com/$path",
            $params,
        );
    }

    protected function arrayImplode(
        string $glue,
        string $separator,
        $array,
    ): string {
        if (!is_array($array)) {
            return $array;
        }

        $string = [];
        foreach ($array as $key => $val) {
            if (is_array($val)) {
                $val = implode(',', $val);
            }
            $string[] = "{$key}{$glue}{$val}";
        }

        return implode($separator, $string);
    }
}
