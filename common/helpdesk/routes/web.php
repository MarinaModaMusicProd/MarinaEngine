<?php

use Helpdesk\Controllers\HcArticleController;
use Helpdesk\Controllers\HcCategoryController;

Route::get('hc/articles/{articleId}/{slug}', [HcArticleController::class, 'show']);
Route::get('hc/articles/{categoryId}/{sectionId}/{articleId}/{slug}', [HcArticleController::class, 'show']);
Route::get('hc/categories/{categoryId}/{sectionId}/{slug}', [HcCategoryController::class, 'show']);
Route::get('hc/categories/{categoryId}/{slug}', [HcCategoryController::class, 'show']);
