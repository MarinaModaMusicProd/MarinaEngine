<?php

namespace App\Console;

use App\Console\Commands\ResetDemoAdminAccount;
use Common\Channels\UpdateAllChannelsContent;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [UpdateAllChannelsContent::class];

    protected function schedule(Schedule $schedule)
    {
        $schedule
            ->command(UpdateAllChannelsContent::class)
            ->dailyAt('03:20')
            ->withoutOverlapping();

        if (config('common.site.demo')) {
            $schedule
                ->command(ResetDemoAdminAccount::class)
                ->dailyAt('03:30')
                ->withoutOverlapping();
        }
    }

    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
