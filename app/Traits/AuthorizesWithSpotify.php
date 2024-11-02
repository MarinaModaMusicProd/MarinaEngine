<?php namespace App\Traits;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

trait AuthorizesWithSpotify
{
    protected string|null $token = null;

    public function authorize(array $options = []): void
    {
        $spotifyId = $options['spotifyId'] ?? config('common.site.spotify.id');
        $spotifySecret =
            $options['spotifySecret'] ?? config('common.site.spotify.secret');
        $force = $options['force'] ?? false;

        if (!$force && ($this->token = $this->getTokenFromFile())) {
            return;
        }

        $response = Http::throw()
            ->asForm()
            ->withHeaders([
                'Authorization' =>
                    'Basic ' . base64_encode($spotifyId . ':' . $spotifySecret),
            ])
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'client_credentials',
            ]);

        $token = $response['access_token'] ?? null;

        if ($token) {
            $this->token = $this->storeTokenFile($token);
        }
    }

    protected function storeTokenFile(string $token): string
    {
        $path = storage_path('app/tokens');
        File::ensureDirectoryExists($path);
        $timestamp = now('UTC')->timestamp;
        $content = [
            'token' => $token,
            'expires_at' => $timestamp + 3600,
        ];
        file_put_contents("$path/spotify.json", json_encode($content));
        return $token;
    }

    protected function getTokenFromFile(): string|null
    {
        $path = storage_path('app/tokens/spotify.json');
        if (!file_exists($path)) {
            return null;
        }

        $content = json_decode(file_get_contents($path), true);
        // token is valid for 1 hour
        if (
            !isset($content['expires_at']) ||
            !isset($content['token']) ||
            Carbon::createFromTimestamp($content['expires_at'])->lessThan(
                now('UTC'),
            )
        ) {
            return null;
        }

        return $content['token'];
    }
}
