<?php

namespace Common\HelpDesk\HelpCenter\Actions;

use Common\Files\FileEntry;
use Common\HelpDesk\Actions\Tag;
use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Common\HelpDesk\HelpCenter\Models\HcTag;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;

class ImportHelpCenter
{
    public function execute(string $path): void
    {
        $zip = new ZipArchive();
        $zip->open($path);

        // store help center images
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $stat = $zip->statIndex($i);
            if (Str::startsWith(dirname($stat['name']), 'images/')) {
                [$root, $folder, $name] = explode('/', $stat['name']);
                Storage::disk('public')->put(
                    "$folder/$name",
                    $zip->getFromIndex($stat['index']),
                );
            }
        }

        $helpCenter = json_decode($zip->getFromName('help-center.json'), true);
        $oldBaseUri = $zip->getFromName('base-url.txt');
        $zip->close();

        // truncate old help center data
        DB::table('categories')->truncate();
        DB::table('articles')->truncate();
        DB::table('category_article')->truncate();

        // unguard models and clear old relations
        HcCategory::unguard();
        HcArticle::unguard();
        HcTag::unguard();
        FileEntry::unguard();
        DB::table('taggables')
            ->where('taggable_type', HcArticle::MODEL_TYPE)
            ->delete();

        collect($helpCenter)->each(function ($categoryData) use ($oldBaseUri) {
            // create categories
            $category = HcCategory::create(
                Arr::except($categoryData, [
                    'sections',
                    'id',
                    'model_type',
                    'is_section',
                    'hidden',
                ]),
            );

            // create sections
            collect($categoryData['sections'])->each(function (
                $sectionData,
            ) use ($category, $oldBaseUri) {
                $sectionData['parent_id'] = $category->id;
                $section = HcCategory::create(
                    Arr::except($sectionData, [
                        'articles',
                        'id',
                        'model_type',
                        'is_section',
                        'hidden',
                    ]),
                );

                // create articles
                collect($sectionData['articles'])->each(function (
                    $articleData,
                ) use ($section, $category, $oldBaseUri) {
                    $articleData[
                        'body'
                    ] = (new ReplaceArticleImageSrc())->execute(
                        $articleData['body'],
                        [$oldBaseUri],
                    );

                    $article = HcArticle::firstOrCreate(
                        Arr::except($articleData, [
                            'tags',
                            'id',
                            'model_type',
                            'article_id',
                            'category_id',
                            'extra_data',
                            'position'
                        ]),
                    );
                    $article
                        ->categories()
                        ->attach([$section->id, $category->id]);

                    // create tags
                    collect($articleData['tags'])->each(function (
                        $tagData,
                    ) use ($article) {
                        $attrs = [
                            'name' => $tagData['name'],
                            'type' => $tagData['type'],
                            'display_name' => $tagData['display_name'],
                        ];
                        $tag = Tag::where('name', $tagData['name'])->first();
                        if (!$tag) {
                            $tag = Tag::create($attrs);
                        }

                        try {
                            $article->tags()->attach($tag->id);
                        } catch (\Exception) {
                        }
                    });
                });
            });
        });

        Cache::flush();
    }
}
