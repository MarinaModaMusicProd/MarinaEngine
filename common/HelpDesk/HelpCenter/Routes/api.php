<?php

//HELP CENTER CATEGORIES
use Common\HelpDesk\HelpCenter\Controllers\HcActionsController;
use Common\HelpDesk\HelpCenter\Controllers\HcArticleAttachmentsController;
use Common\HelpDesk\HelpCenter\Controllers\HcArticleAuthorController;
use Common\HelpDesk\HelpCenter\Controllers\HcArticleController;
use Common\HelpDesk\HelpCenter\Controllers\HcArticleFeedbackController;
use Common\HelpDesk\HelpCenter\Controllers\HcArticleOrderController;
use Common\HelpDesk\HelpCenter\Controllers\HcArticleSearchController;
use Common\HelpDesk\HelpCenter\Controllers\HcCategoryController;
use Common\HelpDesk\HelpCenter\Controllers\HcCategoryOrderController;

// prettier-ignore
Route::group(['prefix' => 'v1'], function () {
    Route::group(['middleware' => ['optionalAuth:sanctum', 'verified', 'verifyApiAccess']], function () {
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
    });
});
