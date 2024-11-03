<?php

// prettier-ignore
use Common\HelpDesk\Ticketing\Controllers\ConversationsAssigneeController;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['middleware' => ['optionalAuth:sanctum', 'verified', 'verifyApiAccess']], function () {
        Route::post('conversations/assign', [ConversationsAssigneeController::class, 'change']);
    });
});
