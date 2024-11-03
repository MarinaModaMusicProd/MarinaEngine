<?php

namespace App\Services\Artists;

use App\Artist;
use App\Services\Providers\Spotify\SpotifyArtist;
use Arr;
use Common\Settings\Settings;
use Illuminate\Database\Eloquent\RelationNotFoundException;

class LoadArtist
{
    public function execute(
        Artist $artist,
        array $params = [],
        $autoUpdate = false,
    ): array {
        if ($autoUpdate && $artist->needsUpdating()) {
            $newArtist = $this->updateArtistFromExternal($artist);
            $artist = $newArtist ?? $artist;
        }

        if (defined('SHOULD_PRERENDER')) {
            $load = ['similar', 'genres', 'profile', 'albums'];
            $loadCount = [];
        } else {
            $load = array_filter(explode(',', Arr::get($params, 'with', '')));
            $loadCount = array_filter(
                explode(',', Arr::get($params, 'withCount', '')),
            );
        }

        if (Arr::get($params, 'forEditing')) {
            $artist->setHidden([]);
        }

        $artist->loadCount($loadCount);

        $response = ['artist' => $artist];

        foreach ($load as $relation) {
            if ($relation === 'similar') {
                if (
                    app(Settings::class)->get('artist_provider') !== 'spotify'
                ) {
                    $similar = app(GetSimilarArtists::class)->execute($artist);
                    $artist->setRelation('similar', $similar);
                } else {
                    $artist->load('similar');
                }
            } elseif ($relation === 'albums') {
                $response['albums'] = app(PaginateArtistAlbums::class)->execute(
                    $artist,
                    $params,
                );
                if (Arr::get($params, 'forEditing')) {
                    $response['albums']->loadCount('tracks');
                    $response['albums']->transform(
                        fn($album) => $album->setHIdden([]),
                    );
                }
            } elseif ($relation === 'tracks') {
                $response['tracks'] = app(PaginateArtistTracks::class)->execute(
                    $artist,
                );
            } elseif ($relation === 'profile') {
                $artist->load(['profile', 'profileImages', 'links']);
            } else {
                try {
                    $artist->load($relation);
                } catch (RelationNotFoundException $e) {
                    //
                }
            }
        }

        return $response;
    }

    public function updateArtistFromExternal(
        Artist $artist,
        ?array $options = [],
    ): Artist {
        $spotifyArtist = app(SpotifyArtist::class)->getContent(
            $artist,
            $options,
        );
        if ($spotifyArtist) {
            $artist = app(ArtistSaver::class)->save($spotifyArtist);
            $artist = app(ArtistBio::class)->get($artist);
            unset($artist['albums']);
        }
        return $artist;
    }
}
