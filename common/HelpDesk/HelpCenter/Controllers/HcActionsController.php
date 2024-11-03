<?php namespace Common\HelpDesk\HelpCenter\Controllers;

use Common\Core\BaseController;
use Common\HelpDesk\HelpCenter\Actions\ExportHelpCenter;
use Common\HelpDesk\HelpCenter\Actions\ImportHelpCenter;

class HcActionsController extends BaseController
{
    public function __construct()
    {
        $this->middleware('isAdmin');
    }

    public function export()
    {
        $filename = (new ExportHelpCenter())->execute(
            request('format', 'json'),
        );

        return response(file_get_contents($filename), 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="hc-export.zip',
        ]);
    }

    public function import()
    {
        $path = storage_path('app/hc-import.zip');
        (new ImportHelpCenter())->execute($path);
        return $this->success();
    }
}
