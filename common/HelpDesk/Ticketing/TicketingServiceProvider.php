<?php

namespace Common\HelpDesk\Ticketing;

use Common\HelpDesk\Ticketing\Models\Conversation;
use Common\HelpDesk\Ticketing\Policies\ConversationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class TicketingServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Routes
        Route::prefix('api')
            ->middleware('api')
            ->group(function () {
                $this->loadRoutesFrom(__DIR__ . '/Routes/api.php');
            });

        // Migrations
        $this->loadMigrationsFrom(__DIR__ . '/Database/migrations');

        // Policies
        Gate::policy(Conversation::class, ConversationPolicy::class);
    }
}
