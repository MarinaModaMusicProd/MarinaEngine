<?php

namespace App\Models;

use App\Services\Albums\PaginateAlbums;
use App\Services\Artists\PaginateArtists;
use App\Services\Channels\FetchContentForChannelFromLastfm;
use App\Services\Channels\FetchContentForChannelFromLocal;
use App\Services\Channels\FetchContentForChannelFromSpotify;
use App\Services\Genres\PaginateGenres;
use App\Services\Playlists\PaginatePlaylists;
use App\Services\Tracks\PaginateTracks;
use Common\Channels\BaseChannel;
use Common\Database\Datasource\Datasource;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class Channel extends BaseChannel
{
    public function artists(): MorphToMany
    {
        return $this->morphedByMany(Artist::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    public function allArtists(
        array $params,
        $builder = null,
    ): AbstractPaginator {
        if (!$builder && $this->restriction) {
            $builder = $this->restriction->artists();
        }
        return (new PaginateArtists())->execute($params, $builder);
    }

    public function albums(): MorphToMany
    {
        return $this->morphedByMany(Album::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    public function allAlbums(array $params, $builder = null): AbstractPaginator
    {
        if (!$builder && $this->restriction) {
            $builder = $this->restriction->albums();
        }
        return (new PaginateAlbums())->execute($params, $builder);
    }

    public function tracks(): MorphToMany
    {
        return $this->morphedByMany(Track::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    public function allTracks(array $params, $builder = null): AbstractPaginator
    {
        if (!$builder && $this->restriction) {
            $builder = $this->restriction->tracks();
        }
        return (new PaginateTracks())->execute($params, $builder);
    }

    public function users(): MorphToMany
    {
        return $this->morphedByMany(User::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    public function allUsers(
        array $params,
        mixed $builder = null,
    ): AbstractPaginator {
        $builder = $builder ?? User::query();
        $builder
            ->select([
                'users.id',
                'email',
                'first_name',
                'last_name',
                'username',
                'image',
            ])
            ->withCount(['followers']);
        return (new Datasource($builder, $params))->paginate();
    }

    public function genres(): MorphToMany
    {
        return $this->morphedByMany(Genre::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    public function allGenres(array $params, $builder = null): AbstractPaginator
    {
        return (new PaginateGenres())->execute($params, $builder);
    }

    public function playlists(): MorphToMany
    {
        return $this->morphedByMany(Playlist::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    public function allPlaylists(
        array $params,
        $builder = null,
    ): AbstractPaginator {
        $builder = $builder ?? Playlist::query();
        $builder->where('public', true)->has('tracks');
        $params['editors'] = true;
        return (new PaginatePlaylists())->execute($params, $builder);
    }

    public function channels(): MorphToMany
    {
        return $this->morphedByMany(Channel::class, 'channelable')->withPivot([
            'id',
            'channelable_id',
            'order',
        ]);
    }

    protected function loadContentFromExternal(
        string $autoUpdateMethod,
    ): Collection|array|null {
        $provider = Arr::get($this->config, 'autoUpdateProvider', 'local');
        $value = Arr::get($this->config, 'autoUpdateValue', null);

        $filters = [];
        if (isset($this->config['restriction'])) {
            $filters[$this->config['restriction']] =
                $this->config['restrictionModelId'];
        }

        return match ($provider) {
            'spotify' => (new FetchContentForChannelFromSpotify())->execute(
                $autoUpdateMethod,
                $value,
            ),
            'local' => (new FetchContentForChannelFromLocal())->execute(
                $autoUpdateMethod,
                $value,
                $filters,
            ),
            'lastfm' => (new FetchContentForChannelFromLastfm())->execute(
                $autoUpdateMethod,
            ),
            default => null,
        };
    }
}
