<?php

namespace Common\HelpDesk\HelpCenter;

use Common\HelpDesk\HelpCenter\Models\HcArticle;
use Common\HelpDesk\HelpCenter\Models\HcCategory;
use Common\HelpDesk\HelpCenter\Policies\HcArticlePolicy;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class HelpCenterServiceProvider extends ServiceProvider
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
        Gate::policy(HcArticle::class, HcArticlePolicy::class);
        Gate::policy(HcCategory::class, HcArticlePolicy::class);

        // Morph map
        Relation::enforceMorphMap([
            HcArticle::MODEL_TYPE => HcArticle::class,
            HcCategory::MODEL_TYPE => HcCategory::class,
        ]);
    }
}
