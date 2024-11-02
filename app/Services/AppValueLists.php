<?php

namespace App\Services;

use App\Models\Genre;
use Common\Core\Values\ValueLists;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class AppValueLists extends ValueLists
{
    public function genres($params = []): Collection
    {
        $query = isset($params['searchQuery'])
            ? Genre::search($params['searchQuery'])
            : Genre::query()->orderByPopularity();

        $genres = $query
            ->take(50)
            ->get()
            ->map(
                fn($keyword) => [
                    'value' => $keyword->id,
                    'name' => $keyword->display_name,
                ],
            );

        if ($selectedValue = Arr::get($params, 'selectedValue')) {
            $selectedGenre = Genre::find($selectedValue);
            if ($selectedGenre) {
                $genres->prepend([
                    'value' => $selectedGenre->id,
                    'name' => $selectedGenre->display_name,
                ]);
            }
        }

        return $genres;
    }
}
