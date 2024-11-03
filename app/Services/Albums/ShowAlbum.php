<?php

namespace App\Services\Albums;

use App\Album;
use App\Artist;
use App\Services\Artists\ArtistSaver;
use App\Services\Providers\ProviderResolver;
use App\Services\Providers\SaveOrUpdate;
use App\Services\Providers\Spotify\SpotifyAlbum;
use App\Services\Providers\Spotify\SpotifyTrackSaver;
use Arr;
use Common\Settings\Settings;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShowAlbum
{
    use SaveOrUpdate;

    public function __construct(
        protected ProviderResolver $resolver,
        protected ArtistSaver $saver,
        protected Settings $settings,
    ) {
    }

    public function execute(
        Album $album,
        array $params,
        bool $autoUpdate = false,
    ): array {
        if ($autoUpdate && $album->needsUpdating()) {
            $this->updateAlbum($album);
        }

        if (
            Arr::get($params, 'defaultRelations') ||
            defined('SHOULD_PRERENDER')
        ) {
            $load = ['tags', 'genres', 'artists', 'fullTracks'];
            $loadCount = ['reposts', 'likes'];
        } else {
            $load = array_filter(explode(',', Arr::get($params, 'with', '')));
            $loadCount = array_filter(
                explode(',', Arr::get($params, 'withCount', '')),
            );
        }

        if (Arr::get($params, 'forEditing')) {
            $album->setHidden([]);
        }

        $response = ['album' => $album];

        foreach ($load as $relation) {
            if ($relation === 'fullTracks') {
                $album->load([
                    'tracks' => function (HasMany $builder) {
                        return $builder->with(['artists', 'tags', 'genres']);
                    },
                ]);
            } else {
                $album->load($relation);
            }
        }

        $album->loadCount($loadCount);

        if ($album->relationLoaded('tracks')) {
            $album->addPopularityToTracks();
        }

        return $response;
    }

    public function updateAlbum(Album $album): Album
    {
        $spotifyAlbum = app(SpotifyAlbum::class)->getContent($album);
        if (!$spotifyAlbum) {
            return $album;
        }

        // if album artists are not in database yet, fetch and save them
        $notSavedArtists = $spotifyAlbum['artists']->filter(function (
            $spotifyArtist,
        ) use ($album) {
            return !$album->artists
                ->where('spotify_id', $spotifyArtist['spotify_id'])
                ->first();
        });
        if (!empty($notSavedArtists)) {
            $this->saveOrUpdate($notSavedArtists, 'artists');
            $artistIds = Artist::whereIn(
                'spotify_id',
                $notSavedArtists->pluck('spotify_id'),
            )->pluck('id');
            $album->artists()->syncWithoutDetaching($artistIds);
        }

        $this->saveOrUpdate(collect([$spotifyAlbum]), 'albums');
        app(SpotifyTrackSaver::class)->save(
            collect([$spotifyAlbum]),
            collect([$album]),
        );

        return $album;
    }
}
