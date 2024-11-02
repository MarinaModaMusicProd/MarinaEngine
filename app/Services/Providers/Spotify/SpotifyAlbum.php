<?php namespace App\Services\Providers\Spotify;

use App;
use App\Models\Album;
use Illuminate\Support\Arr;

class SpotifyAlbum
{
    private SpotifyHttpClient $httpClient;

    private SpotifyNormalizer $normalizer;

    public function __construct(SpotifyNormalizer $normalizer)
    {
        $this->httpClient = App::make(SpotifyHttpClient::class);
        $this->normalizer = $normalizer;
    }

    public function getContent(Album $album): ?array
    {
        if (!$album->spotify_id) {
            return null;
        }

        $spotifyAlbum = $this->httpClient->get("albums/{$album->spotify_id}");
        if (!$spotifyAlbum || !Arr::get($spotifyAlbum, 'id')) {
            return null;
        }

        $normalizedAlbum = $this->normalizer->album($spotifyAlbum);

        // get full info objects for all tracks
        $normalizedAlbum = $this->getTracks($normalizedAlbum);
        $normalizedAlbum['fully_scraped'] = true;

        return $normalizedAlbum;
    }

    private function getTracks(array $normalizedAlbum): array
    {
        $trackIds = $normalizedAlbum['tracks']
            ->pluck('spotify_id')
            ->slice(0, 50)
            ->implode(',');

        $response = $this->httpClient->get("tracks?ids=$trackIds");

        if (!isset($response['tracks'])) {
            return $normalizedAlbum;
        }

        $fullTracks = collect($response['tracks'])->map(function (
            $spotifyTrack,
        ) {
            return $this->normalizer->track($spotifyTrack);
        });

        $normalizedAlbum['tracks'] = $normalizedAlbum['tracks']->map(function (
            $track,
        ) use ($fullTracks) {
            return $fullTracks
                ->where('spotify_id', $track['spotify_id'])
                ->first();
        });

        return $normalizedAlbum;
    }
}
