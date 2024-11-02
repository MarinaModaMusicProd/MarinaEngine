<?php namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Helpdesk\Actions\HelpCenter\ExportHelpCenter;
use Helpdesk\Actions\HelpCenter\ImportHelpCenter;

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
