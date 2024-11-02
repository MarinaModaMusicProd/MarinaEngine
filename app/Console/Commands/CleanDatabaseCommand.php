<?php

namespace App\Console\Commands;

use App\Services\Artists\DeleteArtists;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CleanDatabaseCommand extends Command
{
    protected $signature = 'music:clean {max=10000}';

    protected $description = 'Delete artists with no image';

    public function handle(): void
    {
        $total = 0;
        $max = (int) $this->argument('max');

        $progress = $this->output->createProgressBar($max);
        $progress->start();

        try {
            DB::table('artists')
                ->whereNull('image_small')
                ->chunkById(100, function (Collection $artists) use (
                    $total,
                    $max,
                    $progress,
                ) {
                    (new DeleteArtists())->execute($artists);
                    $progress->advance($artists->count());
                    $total += 100;
                    if ($total >= $max) {
                        $progress->finish();
                        throw new Exception('Max artists deleted');
                    }
                });
        } catch (Exception $e) {
            $progress->finish();
            if ($e->getMessage() !== 'Max artists deleted') {
                throw $e;
            }
        }
    }
}
