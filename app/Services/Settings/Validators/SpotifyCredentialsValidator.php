<?php

namespace App\Services\Settings\Validators;

use App\Traits\AuthorizesWithSpotify;
use Common\Settings\Validators\SettingsValidator;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SpotifyCredentialsValidator implements SettingsValidator
{
    use AuthorizesWithSpotify;

    const KEYS = ['spotify_id', 'spotify_secret'];

    public function fails($values)
    {
        try {
            $this->authorize([
                'spotifyId' => Arr::get($values, 'spotify_id'),
                'spotifySecret' => Arr::get($values, 'spotify_secret'),
                'force' => true,
            ]);
        } catch (RequestException $e) {
            return $this->getMessage($e->response->json());
        }
    }

    private function getMessage(array $errResponse): array
    {
        if ($errResponse['error'] === 'invalid_client') {
            if (Str::contains($errResponse['error_description'], 'secret')) {
                return [
                    'server.spotify_secret' =>
                        'This Spotify Secret is not valid.',
                ];
            } else {
                return [
                    'server.spotify_id' => 'This Spotify ID is not invalid.',
                ];
            }
        } else {
            return [
                'spotify_group' =>
                    'Could not validate spotify credentials, please try again later.',
            ];
        }
    }
}
