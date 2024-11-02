<?php namespace App\Services\Providers\Spotify;

use App\Traits\AuthorizesWithSpotify;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SpotifyHttpClient
{
    use AuthorizesWithSpotify;

    static string $baseUrl = 'https://api.spotify.com/v1';

    public function get(string $uri): array
    {
        if (!$this->token) {
            $this->getToken();
        }

        try {
            return Http::throw()
                ->withHeaders(['Authorization' => 'Bearer ' . $this->token])
                ->timeout(10)
                ->get("https://api.spotify.com/v1/$uri")
                ->json();
        } catch (RequestException $e) {
            Log::error('Spotify API error: ' . $e->response->body());
            return [];
        }
    }

    public function getToken(): void
    {
        try {
            $this->authorize();
        } catch (RequestException $e) {
            Log::error($e->response->body());
        }
    }
}
