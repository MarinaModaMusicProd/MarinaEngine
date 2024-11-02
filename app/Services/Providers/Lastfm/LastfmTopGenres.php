<?php namespace App\Services\Providers\Lastfm;

use App\Models\Genre;
use App\Services\Providers\ContentProvider;
use App\Services\Providers\SaveOrUpdate;
use Common\Settings\Settings;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class LastfmTopGenres implements ContentProvider
{
    use SaveOrUpdate;

    private string $apiKey;

    public function __construct(
        protected Settings $settings,
        protected Genre $genre,
        protected Filesystem $fs,
    ) {
        $this->apiKey = config('common.site.lastfm.key');

        @ini_set('max_execution_time', 0);
    }

    public function getContent()
    {
        $response = Http::throw()->get(
            "http://ws.audioscrobbler.com/2.0?method=tag.getTopTags&api_key=$this->apiKey&format=json&num_res=100",
        );

        // fall back to local genres, if there's an issue with last.fm
        if (!isset($response['toptags']['tag'])) {
            return $this->genre
                ->orderBy('popularity', 'desc')
                ->limit(50)
                ->get();
        }

        $lastfmGenres = collect($response['toptags']['tag']);

        // genres that exist on spotify
        $spotifyGenres = File::getRequire(
            app_path('Services/Providers/Spotify/spotify-genres.php'),
        );
        $lastfmGenres = $lastfmGenres->filter(function ($genre) use (
            $spotifyGenres,
        ) {
            $name = slugify($genre['name']);
            return in_array($name, $spotifyGenres) && $name !== 'swedish';
        });

        // save genres
        return $lastfmGenres->map(function ($genreData, $key) {
            $slugName = slugify($genreData['name']);
            $data = [
                'name' => $slugName,
                // sort based on the order last.fm api returned genres in
                'popularity' => 100 - $key,
                'display_name' => ucfirst($genreData['name']),
                'image' => $this->getImage($slugName),
            ];
            return $this->genre->updateOrCreate(['name' => $slugName], $data);
        });
    }

    private function getImage(string $name): ?string
    {
        $path = "images/genres/$name.jpg";
        return $this->fs->exists(public_path($path)) ? $path : null;
    }
}
