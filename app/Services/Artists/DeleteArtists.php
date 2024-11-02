<?php

namespace App\Services\Artists;

use App\Models\Artist;
use App\Models\ArtistBio;
use App\Models\BackstageRequest;
use App\Models\ProfileImage;
use App\Models\UserProfile;
use App\Services\Albums\DeleteAlbums;
use App\Services\Tracks\DeleteTracks;
use Common\Files\Actions\Deletion\DeleteEntries;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DeleteArtists
{
    public function execute(Collection $artists): void
    {
        $artistIds = $artists->pluck('id');

        // remove locally uploaded images
        $imagePaths = $artists->pluck('image_small')->filter();
        app(DeleteEntries::class)->execute([
            'paths' => $imagePaths->toArray(),
        ]);

        // remove artist bios
        ArtistBio::whereIn('artist_id', $artistIds)->delete();

        // detach similar artists
        DB::table('similar_artists')
            ->whereIn('artist_id', $artistIds)
            ->orWhereIn('similar_id', $artistIds)
            ->delete();

        // detach users
        DB::table('user_artist')
            ->whereIn('artist_id', $artistIds)
            ->delete();
        UserProfile::whereIn('artist_id', $artistIds)->delete();

        // detach likes
        DB::table('likes')
            ->where('likeable_type', Artist::MODEL_TYPE)
            ->whereIn('likeable_id', $artistIds)
            ->delete();

        // delete profile images
        ProfileImage::whereIn('artist_id', $artistIds)->delete();

        // delete backstage requests
        BackstageRequest::whereIn('artist_id', $artistIds)->delete();

        // detach genres
        DB::table('genreables')
            ->where('genreable_type', Artist::MODEL_TYPE)
            ->whereIn('genreable_id', $artistIds)
            ->delete();

        // detach channels
        DB::table('channelables')
            ->where('channelable_type', Artist::MODEL_TYPE)
            ->whereIn('channelable_id', $artistIds)
            ->delete();

        // delete albums
        app(DeleteAlbums::class)->execute(
            DB::table('artist_album')
                ->whereIn('artist_id', $artistIds)
                ->where('primary', true)
                ->pluck('album_id'),
        );

        // delete tracks
        app(DeleteTracks::class)->execute(
            DB::table('artist_track')
                ->whereIn('artist_id', $artistIds)
                ->where('primary', true)
                ->pluck('track_id')
                ->toArray(),
        );

        Artist::destroy($artists->pluck('id'));
    }
}
