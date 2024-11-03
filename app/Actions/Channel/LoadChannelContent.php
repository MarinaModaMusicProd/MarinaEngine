<?php

namespace App\Actions\Channel;

use App\Album;
use App\Artist;
use App\Channel;
use App\Genre;
use App\Playlist;
use App\Services\Albums\PaginateAlbums;
use App\Services\Artists\PaginateArtists;
use App\Services\Genres\PaginateGenres;
use App\Services\Playlists\PaginatePlaylists;
use App\Services\Tracks\PaginateTracks;
use App\Track;
use App\User;
use BadMethodCallException;
use Common\Core\Prerender\Actions\ReplacePlaceholders;
use Common\Database\Datasource\Datasource;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class LoadChannelContent
{
    public function execute(
        Channel $channel,
        array $params = [],
        Channel $parent = null,
    ): ?AbstractPaginator {
        $params['perPage'] = $params['perPage'] ?? 50;
        if (!isset($params['orderBy']) && !isset($params['order'])) {
            $params['order'] = Arr::get($channel->config, 'contentOrder');
        }

        $this->maybeConnectToGenre($channel, $params, $parent);

        if ($paginator = $this->maybeLoadViaQuery($channel, $params)) {
            return $paginator;
        } else {
            $paramsKey = json_encode($params);
            return Cache::remember(
                // use "updated at" so channel changes from admin area will automatically
                // cause new cache item, without having to clear cache manually
                "channels.$channel->id.$channel->updated_at.$paramsKey",
                1440,
                fn() => $this->load($channel, $params),
            );
        }
    }

    private function maybeLoadViaQuery(
        Channel $channel,
        array $params,
    ): ?AbstractPaginator {
        if (Arr::get($channel->config, 'contentType') === 'listAll') {
            switch (Arr::get($channel->config, 'contentModel')) {
                case Artist::MODEL_TYPE:
                    return app(PaginateArtists::class)->execute(
                        $params,
                        $channel->genre,
                    );
                case Album::MODEL_TYPE:
                    return app(PaginateAlbums::class)->execute(
                        $params,
                        $channel->genre,
                    );
                case Track::MODEL_TYPE:
                    return app(PaginateTracks::class)->execute(
                        $params,
                        $channel->genre,
                    );
                case Genre::MODEL_TYPE:
                    return app(PaginateGenres::class)->execute($params);
                case Playlist::MODEL_TYPE:
                    $builder = Playlist::where('public', true)->has('tracks');
                    return app(PaginatePlaylists::class)->execute(
                        $params,
                        $builder,
                    );
                case User::MODEL_TYPE:
                    $datasource = new Datasource(
                        User::withCount('followers'),
                        $params,
                    );
                    return $datasource->paginate();
            }
        }
        return null;
    }

    private function load(Channel $channel, array $params): ?AbstractPaginator
    {
        // channel consists of single model type only, can use laravel relation to load records
        if ($contentModel = Arr::get($channel, 'config.contentModel')) {
            $builder = $this->getQueryBuilderFor($contentModel, $channel);
            $datasource = new Datasource($builder, $params);
            $order = $datasource->getOrder();

            // get only column name, in case it's prefixed with table name
            if (last(explode('.', $order['col'])) === 'popularity') {
                $datasource->order = false;
                try {
                    $builder->orderByPopularity($order['dir']);
                } catch (BadMethodCallException $e) {
                    //
                }
            }

            $pagination = $datasource->paginate();
            $pagination->transform(function (Model $model) use (
                $channel,
                $params,
            ) {
                $model['channelable_id'] = $model->pivot->id;
                $model['channelable_order'] = $model->pivot->order;
                if ($model instanceof Channel) {
                    $model->loadContent(
                        array_merge($params, [
                            // clear parent channel pagination params and only load 10 items per nested channel
                            'perPage' => 10,
                            'page' => 1,
                            'paginate' => 'simple',
                            // clear this so nested channel always uses sorting order set in that channel's config
                            'order' => null,
                        ]),
                        $channel,
                    );
                }
                return $model;
            });
            return $pagination;
        }

        return null;
    }

    private function getQueryBuilderFor(
        string $modelType,
        Channel $channel,
    ): Builder {
        switch ($modelType) {
            case Album::MODEL_TYPE:
                return $channel->albums()->with('artists');
            case Artist::MODEL_TYPE:
                return $channel
                    ->artists()
                    ->select(['name', 'artists.id', 'image_small']);
            case User::MODEL_TYPE:
                return $channel
                    ->users()
                    ->select([
                        'users.id',
                        'email',
                        'first_name',
                        'last_name',
                        'username',
                        'avatar',
                    ]);
            case Genre::MODEL_TYPE:
                return $channel->genres();
            case Playlist::MODEL_TYPE:
                return $channel->playlists()->with('editors');
            case Channel::MODEL_TYPE:
                return $channel->channels();
            // default to showing tracks, instead of crashing
            default:
                return $channel
                    ->tracks()
                    ->with('album.artists', 'artists', 'genres')
                    ->withCount('plays');
        }
    }

    private function maybeConnectToGenre(
        Channel $channel,
        array $params = [],
        Channel $parent = null,
    ): void {
        if (
            !Arr::get($params, 'forAdmin') &&
            Arr::get($channel->config, 'connectToGenreViaUrl')
        ) {
            $filter = Arr::get($params, 'filter');
            if (!$filter) {
                abort(404);
            }
            $genre =
                $parent->genre ??
                Genre::where('name', $filter)
                    ->select(['id', 'name', 'display_name'])
                    ->firstOrFail();
            $channel->setAttribute('genre', $genre);

            if (!$genre->display_name) {
                $genre->display_name = ucwords($genre->name);
            }

            $channel->name =
                app(ReplacePlaceholders::class)->execute($channel->name, [
                    'channel' => $channel,
                ]) ?:
                $channel->name;
        }
    }
}
