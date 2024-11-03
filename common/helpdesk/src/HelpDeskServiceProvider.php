<?php

namespace Helpdesk;

use Common\Auth\Events\UserCreated;
use Common\Auth\Events\UsersDeleted;
use Helpdesk\Models\AgentInvite;
use Helpdesk\Models\CannedReply;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\Group;
use Helpdesk\Models\HcArticle;
use Helpdesk\Models\HcCategory;
use Helpdesk\Policies\CannedReplyPolicy;
use Helpdesk\Policies\ConversationPolicy;
use Helpdesk\Policies\GroupPolicy;
use Helpdesk\Policies\HcArticlePolicy;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class HelpDeskServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Routes
        Route::prefix('api')
            ->middleware('api')
            ->group(function () {
                $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');
            });
        Route::middleware('web')->group(function () {
            $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
        });

        // Migrations
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        // Views
        $this->callAfterResolving('view', function ($view) {
            $view->addLocation(__DIR__ . '/../resources/views');
        });

        // Policies
        Gate::policy(HcArticle::class, HcArticlePolicy::class);
        Gate::policy(HcCategory::class, HcArticlePolicy::class);
        Gate::policy(Conversation::class, ConversationPolicy::class);
        Gate::policy(GroupPolicy::class, GroupPolicy::class);
        Gate::policy(CannedReply::class, CannedReplyPolicy::class);

        // Morph map
        Relation::enforceMorphMap([
            HcArticle::MODEL_TYPE => HcArticle::class,
            HcCategory::MODEL_TYPE => HcCategory::class,
            Group::MODEL_TYPE => Group::class,
            AgentInvite::MODEL_TYPE => AgentInvite::class,
        ]);

        // Events
        Event::listen(UserCreated::class, function (UserCreated $e) {
            if ($e->user->isAgent()) {
                Group::findDefault()
                    ?->users()
                    ->attach($e->user);
            }
        });
        Event::listen(UsersDeleted::class, function (UsersDeleted $e) {
            foreach ($e->users as $user) {
                Group::findDefault()
                    ?->users()
                    ->detach($user);
            }
        });
    }
}
