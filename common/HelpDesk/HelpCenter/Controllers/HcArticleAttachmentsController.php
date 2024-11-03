<?php

namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\Files\FileEntry;
use Common\Files\Response\DownloadFilesResponse;
use Common\HelpDesk\HelpCenter\Models\HcArticle;

class HcArticleAttachmentsController extends BaseController
{
    public function download(HcArticle $article, $hashes)
    {
        $this->authorize('show', $article);

        $hashes = explode(',', $hashes);
        $fileEntryIds = array_map(
            fn($hash) => app(FileEntry::class)->decodeHash($hash),
            $hashes,
        );

        $fileEntries = $article
            ->attachments()
            ->whereIn('file_entries.id', $fileEntryIds)
            ->get();

        if ($fileEntries->isEmpty()) {
            abort(404);
        }

        return app(DownloadFilesResponse::class)->create($fileEntries);
    }
}
