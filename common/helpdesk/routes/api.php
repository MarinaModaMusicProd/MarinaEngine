<?php

use Helpdesk\Controllers\AgentInvitesController;
use Helpdesk\Controllers\AgentsController;
use Helpdesk\Controllers\CannedRepliesController;
use Helpdesk\Controllers\ConversationsAssigneeController;
use Helpdesk\Controllers\GroupsController;
use Helpdesk\Controllers\HcActionsController;
use Helpdesk\Controllers\HcArticleAttachmentsController;
use Helpdesk\Controllers\HcArticleAuthorController;
use Helpdesk\Controllers\HcArticleController;
use Helpdesk\Controllers\HcArticleFeedbackController;
use Helpdesk\Controllers\HcArticleOrderController;
use Helpdesk\Controllers\HcArticleSearchController;
use Helpdesk\Controllers\HcCategoryController;
use Helpdesk\Controllers\HcCategoryOrderController;
use Helpdesk\Controllers\HcLandingPageController;
use Helpdesk\Controllers\HelpDeskAutocompleteController;
use Helpdesk\Controllers\ModifyTextWithAIController;
use Helpdesk\Controllers\NormalizedAgentModelsController;
use Helpdesk\Controllers\TriggerController;

// prettier-ignore
Route::group(['prefix' => 'v1'], function () {
    Route::group(['middleware' => ['optionalAuth:sanctum', 'verified', 'verifyApiAccess']], function () {
        //HELP CENTER
        Route::get('hc', HcLandingPageController::class);

        // HELP CENTER CATEGORIES
        Route::get('hc/sidenav/{categoryId}', [HcCategoryController::class, 'sidenavContent']);
        Route::get('hc/categories', [HcCategoryController::class, 'index']);
        Route::get('hc/categories/{categoryId}', [HcCategoryController::class, 'show']);
        Route::post('hc/categories', [HcCategoryController::class, 'store']);
        Route::post('hc/categories/reorder', HcCategoryOrderController::class);
        Route::post('hc/categories/{category}/articles/reorder', HcArticleOrderController::class);
        Route::put('hc/categories/{id}', [HcCategoryController::class, 'update']);
        Route::delete('hc/categories/{id}', [HcCategoryController::class, 'destroy']);

        // HELP CENTER ARTICLES
        Route::get('hc/articles/{categoryId}/{sectionId}/{articleId}', [HcArticleController::class, 'show']);
        Route::get('hc/articles/{articleId}', [HcArticleController::class, 'show']);
        Route::get('hc/articles/{article}/download/{hashes}', [HcArticleAttachmentsController::class, 'download']);
        Route::get('hc/articles', [HcArticleController::class, 'index']);
        Route::post('hc/articles', [HcArticleController::class, 'store']);
        Route::put('hc/articles/{article}', [HcArticleController::class, 'update']);
        Route::post('hc/articles/{article}/feedback', [HcArticleFeedbackController::class, 'store']);
        Route::delete('hc/articles/{id}', [HcArticleController::class, 'destroy']);

        // SEARCH
        Route::get('search/articles', HcArticleSearchController::class);

        // HELP CENTER AUTOCOMPLETE
        Route::get('autocomplete/article-authors', [HcArticleAuthorController::class, 'index']);
        Route::get('autocomplete/article-authors/{userId}', [HcArticleAuthorController::class, 'show']);

        //HElP CENTER IMPORT/EXPORT
        Route::post('hc/actions/import', [HcActionsController::class, 'import']);
        Route::get('hc/actions/export', [HcActionsController::class, 'export']);

        Route::post('conversations/assign', [ConversationsAssigneeController::class, 'change']);
        Route::get('helpdesk/autocomplete/agent', [HelpDeskAutocompleteController::class, 'agents']);
        Route::get('helpdesk/normalized-models/agent/{id}', [NormalizedAgentModelsController::class, 'show']);
        Route::get('helpdesk/normalized-models/agent', [NormalizedAgentModelsController::class, 'index']);
        Route::get('helpdesk/autocomplete/roles', [HelpDeskAutocompleteController::class, 'roles']);
        Route::get('helpdesk/autocomplete/groups', [HelpDeskAutocompleteController::class, 'groups']);

        // groups
        Route::get('helpdesk/groups', [GroupsController::class, 'index']);
        Route::get('helpdesk/groups/{groupId}', [GroupsController::class, 'show']);
        Route::post('helpdesk/groups', [GroupsController::class, 'store']);
        Route::put('helpdesk/groups/{groupId}', [GroupsController::class, 'update']);
        Route::delete('helpdesk/groups/{groupId}', [GroupsController::class, 'destroy']);

        // agent invites
        Route::get('helpdesk/agents/invites', [AgentInvitesController::class, 'index']);
        Route::post('helpdesk/agents/invite/{inviteId}/resend', [AgentInvitesController::class, 'resend']);
        Route::post('helpdesk/agents/invite', [AgentInvitesController::class, 'store']);
        Route::delete('helpdesk/agents/invite/{inviteId}', [AgentInvitesController::class, 'destroy']);

        // agents
        Route::get('helpdesk/agents', [AgentsController::class, 'index']);
        Route::get('helpdesk/agents/{agentId}', [AgentsController::class, 'show']);
        Route::put('helpdesk/agents/{agentId}', [AgentsController::class, 'update']);

        // canned replies
        Route::apiResource('helpdesk/canned-replies', CannedRepliesController::class);

        //TRIGGERS
        Route::get('triggers', [TriggerController::class, 'index']);
        Route::get('triggers/config', [TriggerController::class, 'config']);
        Route::get('triggers/{trigger}', [TriggerController::class, 'show']);
        Route::post('triggers', [TriggerController::class, 'store']);
        Route::put('triggers/{trigger}', [TriggerController::class, 'update']);
        Route::delete('triggers/{ids}', [TriggerController::class, 'destroy']);

        // AI
        Route::post('ai/modify-text', ModifyTextWithAIController::class);
    });
});
