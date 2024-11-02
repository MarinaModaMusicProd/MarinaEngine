<?php

namespace Helpdesk;

use Common\Auth\Events\UserCreated;
use Common\Auth\Events\UsersDeleted;
use Common\Tags\TaggableController;
use Helpdesk\Events\ConversationCreated;
use Helpdesk\Events\ConversationsUpdated;
use Helpdesk\Models\AgentInvite;
use Helpdesk\Models\CannedReply;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\Group;
use Helpdesk\Models\HcArticle;
use Helpdesk\Models\HcCategory;
use Helpdesk\Models\Trigger;
use Helpdesk\Policies\CannedReplyPolicy;
use Helpdesk\Policies\ConversationPolicy;
use Helpdesk\Policies\GroupPolicy;
use Helpdesk\Policies\HcArticlePolicy;
use Helpdesk\Policies\TriggerPolicy;
use Helpdesk\Triggers\TriggersCycle;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;
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
        Gate::policy(Trigger::class, TriggerPolicy::class);

        // Morph map
        Relation::enforceMorphMap([
            HcArticle::MODEL_TYPE => HcArticle::class,
            HcCategory::MODEL_TYPE => HcCategory::class,
            Group::MODEL_TYPE => Group::class,
            AgentInvite::MODEL_TYPE => AgentInvite::class,
        ]);

        // User events
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

        // Conversation events
        Event::listen(ConversationsUpdated::class, function (
            ConversationsUpdated $e,
        ) {
            $cycle = new TriggersCycle();
            foreach ($e->conversationsAfterUpdate as $conversation) {
                $cycle->runAgainstConversation(
                    $conversation,
                    $e->conversationsDataBeforeUpdate[$conversation->id],
                );
            }
        });
        Event::listen(ConversationCreated::class, function (
            ConversationCreated $e,
        ) {
            (new TriggersCycle())->runAgainstConversation($e->conversation);
        });

        $tagEvent = null;
        TaggableController::$beforeTagChangeCallbacks[] = function (
            Collection $taggables,
        ) use(&$tagEvent) {
            if ($taggables->every(fn($t) => $t->model_type === 'chat' || $t->model_type === 'ticket')) {
                $tagEvent = new ConversationsUpdated($taggables);
            }
        };
        TaggableController::$afterTagChangeCallbacks[] = function (
            Collection $taggables,
        ) use(&$tagEvent) {
            if ($tagEvent) {
                $tagEvent->dispatch($taggables);
            }
        };
    }
}
