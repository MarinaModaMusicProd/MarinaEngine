<?php

namespace Livechat;

use Common\Websockets\API\WebsocketAPI;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Foundation\CachesConfiguration;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Livechat\Commands\ChatCycleCommand;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisit;
use Livechat\Models\ChatVisitor;
use Livechat\Policies\ChatFileEntryPolicy;
use Livechat\Policies\ChatPolicy;
use Livechat\Policies\ChatVisitorPolicy;
use Livechat\Policies\ChatVisitPolicy;

class LiveChatServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // config
        $this->mergeConfigFrom(
            __DIR__ . '/../config/searchable_models.php',
            'searchable_models',
        );

        // Routes
        Route::prefix('api')
            ->middleware('api')
            ->group(function () {
                $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');
            });
        Route::middleware('web')->group(function () {
            $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
        });

        // Broadcast routes
        require __DIR__ . '/../routes/channels.php';

        // Migrations
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        // views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'livechat');

        // Policies
        Gate::policy(Chat::class, ChatPolicy::class);
        Gate::policy(ChatVisit::class, ChatVisitPolicy::class);
        Gate::policy(ChatVisitor::class, ChatVisitorPolicy::class);
        Gate::policy('chatFileEntry', ChatFileEntryPolicy::class);

        // Morph map
        Relation::enforceMorphMap([
            Chat::MODEL_TYPE => Chat::class,
            ChatVisit::MODEL_TYPE => ChatVisit::class,
            ChatVisitor::MODEL_TYPE => ChatVisitor::class,
        ]);

        // Commands
        if ($this->app->runningInConsole()) {
            $this->commands([ChatCycleCommand::class]);

            $this->app->booted(function () {
                $schedule = $this->app->make(Schedule::class);
                $schedule->command(ChatCycleCommand::class)->everyMinute();
            });
        }

        // guest auth guard for broadcasting presence channel that supports guests
        Auth::viaRequest('livechatVisitor', function () {
            return ChatVisitor::getOrCreateForCurrentRequest();
        });
        if (
            !(
                $this->app instanceof CachesConfiguration &&
                $this->app->configurationIsCached()
            )
        ) {
            $config = $this->app->make('config');
            $config->set('auth.guards.livechatVisitor', [
                'driver' => 'livechatVisitor',
            ]);
        }

        // Create only one websocket API instance so API requests are made only once per request
        $this->app->singleton(WebsocketAPI::class, function (
            Application $app,
            array $options = [],
        ) {
            return new WebsocketAPI($options ?? []);
        });
    }
}
