<?php

namespace App\Services\Channels;

use App\Services\Providers\Lastfm\LastfmTopGenres;
use Illuminate\Support\Collection;

class FetchContentForChannelFromLastfm
{
    public function execute(string $method): Collection|null
    {
        return match ($method) {
            'topGenres' => app(LastfmTopGenres::class)->getContent(),
            default => null,
        };
    }
}
