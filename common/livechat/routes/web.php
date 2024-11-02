<?php

use Livechat\Controllers\ChatVisitsController;

// visits
Route::post('lc/visits/{visitId}/change-status', [ChatVisitsController::class, 'changeStatus']);

// make sure widget and all widget/* routes are handled by widget router correctly
Route::get('widget', '\LiveChat\Controllers\WidgetHomeController');
Route::get('widget/{any}', '\LiveChat\Controllers\WidgetHomeController')->where('any', '.*');
