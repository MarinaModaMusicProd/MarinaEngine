<?php

namespace Common\Core\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnableDebugIfLoggedInAsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($this->loggedInAsAdmin()) {
            config(['app.debug' => true]);
        }

        return $next($request);
    }

    protected function loggedInAsAdmin(): bool
    {
        try {
            // prevent this from causing issues with updating to new versions
            return Auth::user() && Auth::user()->hasPermission('admin');
        } catch (\Throwable $e) {
            return false;
        }
    }
}
