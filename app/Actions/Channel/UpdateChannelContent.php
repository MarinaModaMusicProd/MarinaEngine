<?php

namespace App\Actions\Channel;

use App\Channel;
use App\Services\Providers\Lastfm\LastfmTopGenres;
use App\Services\Providers\Spotify\SpotifyNewAlbums;
use App\Services\Providers\Spotify\SpotifyPlaylist;
use App\Services\Providers\Spotify\SpotifyTopTracks;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UpdateChannelContent
{
    public function execute(Channel $channel, string $autoUpdateMethod = null): void
    {
        $content = $this->getContent($channel, $autoUpdateMethod);

        // bail if we could not fetch any content
        if (!$content || $content->isEmpty()) {
            return;
        }

        // detach all channel items from the channel
        DB::table('channelables')
            ->where([
                'channel_id' => $channel->id,
            ])
            ->delete();

        // group content by model type (track, album, playlist etc)
        // and attach each group via its own separate relation
        $groupedContent = $content->groupBy('model_type');
        $groupedContent->each(function (
            Collection $contentGroup,
            $modelType,
        ) use ($channel) {
            $pivots = $contentGroup->mapWithKeys(function ($item, $index) {
                return [$item['id'] => ['order' => $index]];
            });
            // track => tracks
            $relation = Str::plural($modelType);
            $channel->$relation()->syncWithoutDetaching($pivots->toArray());
        });

        // clear channel cache, it's based on updated_at timestamp
        $channel->touch();
    }

    private function getContent(
        Channel $channel,
        string $autoUpdateMethod = null,
    ) {
        $method =
            $autoUpdateMethod ?? Arr::get($channel->config, 'autoUpdateMethod');
        switch ($method) {
            case 'spotifyTopTracks':
                return app(SpotifyTopTracks::class)->getContent();
            case 'spotifyNewAlbums':
                return app(SpotifyNewAlbums::class)->getContent();
            case 'lastfmTopGenres':
                return app(LastfmTopGenres::class)->getContent();
            case 'spotifyPlaylistTracks':
                return app(SpotifyPlaylist::class)->getContent(
                    $channel->config['autoUpdateValue'],
                )['tracks'];
        }
    }
}
