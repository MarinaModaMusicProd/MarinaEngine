<?php

namespace App\Console\Commands;

use App\Actions\Channel\UpdateChannelContent;
use App\Channel;
use Illuminate\Console\Command;

class UpdateAllChannelsContent extends Command
{
    protected $signature = 'channels:update';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        app(Channel::class)
            ->limit(20)
            ->get()
            ->each(function (Channel $channel) {
                app(UpdateChannelContent::class)->execute($channel);
            });
    }
}
