<?php

use Illuminate\Support\Facades\Route;
use Livechat\Controllers\AvailableAgentsController;
use Livechat\Controllers\ChatAssigneeController;
use Livechat\Controllers\ChatMessageController;
use Livechat\Controllers\ChatStatusController;
use Livechat\Controllers\ChatVisitorsController;
use Livechat\Controllers\ChatVisitsController;
use Livechat\Controllers\DashboardArchiveController;
use Livechat\Controllers\DashboardChatController;
use Livechat\Controllers\DashboardChatMessagesController;
use Livechat\Controllers\MostRecentChatController;
use Livechat\Controllers\QueuedChatInfoController;
use Livechat\Controllers\RecentChatsController;
use Livechat\Controllers\WidgetChatController;
use Livechat\Controllers\WidgetChatMessagesController;
use Livechat\Controllers\WidgetHelpController;
use Livechat\Controllers\WidgetHomeController;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['middleware' => ['optionalAuth:sanctum', 'verified', 'verifyApiAccess']], function () {

        // chats
        Route::get('lc/dashboard/chats', [DashboardChatController::class, 'index']);
        Route::get('lc/dashboard/chats/{chatId}', [DashboardChatController::class, 'show']);
        Route::get('lc/dashboard/archived-chats', [DashboardArchiveController::class, 'index']);
        Route::get('lc/chats', [WidgetChatController::class, 'index']);
        Route::get('lc/chats/most-recent', MostRecentChatController::class);
        Route::get('lc/chats/{chatId}', [WidgetChatController::class, 'show']);
        Route::post('lc/chats', [WidgetChatController::class, 'store']);
        Route::put('lc/chats/{chatId}/update-status', [ChatStatusController::class, 'update']);

        // chat messages
        Route::get('lc/messages/widget', [WidgetChatMessagesController::class, 'index']);
        Route::get('lc/messages/dashboard', [DashboardChatMessagesController::class, 'index']);
        Route::post('lc/messages/{chat}', [ChatMessageController::class, 'store']);

        // visitors
        Route::get('lc/visitors', [ChatVisitorsController::class, 'index']);
        Route::get('lc/visitors/{visitorId}', [ChatVisitorsController::class, 'show']);
        Route::get('lc/visitors/{visitorId}/visits', [ChatVisitsController::class, 'index']);
        Route::post('lc/visitors/{visitorId}/visits', [ChatVisitsController::class, 'store']);
        Route::get('lc/visitors/{visitorId}/recent-chats', RecentChatsController::class);

        // widget
        Route::get('lc/widget/help-center-data', [WidgetHelpController::class, 'helpCenterData']);

        // agents
        Route::get('lc/all-agents', AvailableAgentsController::class);
        Route::post('lc/chats/assign', [ChatAssigneeController::class, 'update']);
    });

    Route::get('livechat-widget-bootstrap-data', WidgetHomeController::class);
});
