<?php namespace App\Http\Controllers;

use App\Http\Requests\ModifyArtists;
use App\Models\Artist;
use App\Services\Artists\ArtistLoader;
use App\Services\Artists\CrupdateArtist;
use App\Services\Artists\DeleteArtists;
use App\Services\Artists\PaginateArtists;
use App\Services\IncrementModelViews;
use Common\Core\BaseController;

class ArtistController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Artist::class);

        $pagination = app(PaginateArtists::class)->execute(
            request()->all(),
            Artist::withCount(['albums']),
        );

        $pagination->makeVisible(['updated_at', 'views', 'plays', 'verified']);

        return $this->success(['pagination' => $pagination]);
    }

    public function show(Artist $artist)
    {
        $this->authorize('show', $artist);

        $loader = request('loader', 'artistPage');
        $data = (new ArtistLoader())->execute($artist, $loader);

        (new IncrementModelViews())->execute($artist->id, 'artist');

        return $this->renderClientOrApi([
            'pageName' => $loader === 'artistPage' ? 'artist-page' : null,
            'data' => $data,
        ]);
    }

    public function store(ModifyArtists $request)
    {
        $this->authorize('store', Artist::class);

        $artist = app(CrupdateArtist::class)->execute($request->all());

        return $this->success(['artist' => $artist]);
    }

    public function update(Artist $artist, ModifyArtists $request)
    {
        $this->authorize('update', $artist);

        $artist = app(CrupdateArtist::class)->execute($request->all(), $artist);

        return $this->success(['artist' => $artist]);
    }

    public function destroy(string $ids)
    {
        $artistIds = explode(',', $ids);
        $this->authorize('destroy', [Artist::class, $artistIds]);

        $artists = Artist::whereIn('id', $artistIds)->get();

        (new DeleteArtists())->execute($artists);

        return $this->success();
    }
}
