<?php

namespace Common\Admin\Appearance\Controllers;

use Common\Core\BaseController;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;

class SeoTagsController extends BaseController
{
    public function show(string $names)
    {
        $this->authorize('update', 'AppearancePolicy');

        $names = explode(',', $names);

        $response = [];

        foreach ($names as $name) {
            try {
                $finder = View::getFinder();
                $response[$name] = [
                    'custom' => View::exists("editable-views::seo-tags.$name")
                        ? file_get_contents(
                            $finder->find("editable-views::seo-tags.$name"),
                        )
                        : null,
                    'original' => file_get_contents(
                        $finder->find("seo.$name.seo-tags"),
                    ),
                ];
            } catch (Exception $e) {
                //
            }
        }

        return $this->success($response);
    }

    public function update(string $name)
    {
        $this->authorize('update', 'AppearancePolicy');

        $data = $this->validate(request(), [
            'tags' => 'required|string',
        ]);

        $directory = storage_path('app/editable-views/seo-tags');
        File::ensureDirectoryExists($directory);

        file_put_contents("$directory/$name.blade.php", $data['tags']);

        return $this->success();
    }
}
