<?php

namespace Common\HelpDesk\HelpCenter\Actions;

use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use ZipArchive;

class ExportHelpCenter
{
    protected ZipArchive $zip;

    public function execute($format)
    {
        $filename = storage_path('app/hc-export.zip');
        @unlink($filename);

        $this->zip = new ZipArchive();
        if ($this->zip->open($filename, ZipArchive::CREATE) !== true) {
            return null;
        }

        // get all hc categories
        $categories = HcCategory::rootOnly()
            ->with([
                'sections' => function ($builder) {
                    $builder->with([
                        'articles' => function ($builder) {
                            $builder->with('tags')->select('*');
                        },
                    ]);
                },
            ])
            ->get();

        if ($format === 'html') {
            $this->exportAsHtml($categories);
        } else {
            (new ExportHelpCenterImages())->execute($this->zip);
            $this->zip->addFromString('base-url.txt', config('app.url'));
            $this->zip->addFromString(
                'help-center.json',
                json_encode($categories),
            );
        }

        $this->zip->close();

        return $filename;
    }

    private function exportAsHtml(Collection $categories): void
    {
        $categories->each(function (HcCategory $category) {
            $prefix = slugify($category->name);

            // styles
            $styles = File::files(resource_path('views/help-center/styles'));
            foreach ($styles as $fileInfo) {
                $baseName = $fileInfo->getBasename();
                $this->zip->addFromString(
                    "$prefix/assets/styles/$baseName",
                    $fileInfo->getContents(),
                );
            }

            // scripts
            $this->zip->addFromString(
                "$prefix/assets/docs-scripts.js",
                File::get(resource_path('views/help-center/docs-scripts.js')),
            );

            $category->sections->each(function (
                HcCategory $section,
                           $sectionIndex,
            ) use ($category, $prefix) {
                $section->articles->each(function (
                    HcArticle $article,
                              $articleIndex,
                ) use ($category, $section, $prefix, $sectionIndex) {
                    (new ExportHelpCenterImages())->execute(
                        $this->zip,
                        $article,
                        "$prefix/assets",
                    );

                    // replace image urls with relative local path
                    if ($article->body) {
                        $article->body = (new ReplaceArticleImageSrc())->execute(
                            $article->body,
                            ['storage', config('app.url') . '/storage'],
                            '../../assets/images',
                        );
                    }

                    // render blade article template into string
                    $renderedArticle = view('help-center.article')
                        ->with([
                            'category' => $category,
                            'article' => $article,
                        ])
                        ->render();

                    $articleName = slugify($article->title);
                    $categoryName = slugify($section->name);
                    $articlePath = "articles/$categoryName/$articleName.html";
                    $this->zip->addFromString(
                        "$prefix/$articlePath",
                        $renderedArticle,
                    );

                    // create index.html with redirect to first article
                    if ($sectionIndex === 0 && $articleIndex === 0) {
                        $html = view('help-center.docs-index')->with(
                            'url',
                            $articlePath,
                        );
                        $this->zip->addFromString("$prefix/index.html", $html);
                    }
                });
            });
        });
    }
}
