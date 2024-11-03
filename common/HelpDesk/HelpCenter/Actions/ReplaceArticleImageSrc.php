<?php

namespace Common\HelpDesk\HelpCenter\Actions;

use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;

class ReplaceArticleImageSrc
{
    public function execute(
        string $body,
        array $oldBaseUris,
        string|null $newBaseUri = null,
    ): string {
        $crawler = new Crawler();
        $crawler->addHtmlContent($body);
        $newBaseUri = $newBaseUri ?: config('app.url');

        $crawler
            ->filter('img')
            ->each(function (Crawler $node) use ($oldBaseUris, $newBaseUri) {
                $oldSrc = $node->attr('src');
                $oldBaseUris[] = 'http://localhost:4200';

                if (Str::contains($oldSrc, $oldBaseUris)) {
                    $newSrc = str_replace($oldBaseUris, $newBaseUri, $oldSrc);
                    $node->getNode(0)->setAttribute('src', $newSrc);
                }
            });

        return $crawler->filter('body')->html();
    }
}
