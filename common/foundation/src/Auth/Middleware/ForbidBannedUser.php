<?php

namespace Common\Auth\Middleware;

use Closure;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;

class ForbidBannedUser
{
    public function __construct(protected StatefulGuard $guard)
    {
    }

    public function handle(Request $request, Closure $next)
    {
        if (
            $request->user()?->isBanned() &&
            $request->path() !== '/' &&
            $request->path() !== 'auth/logout'
        ) {
            abort(403);
        }

        return $next($request);
    }
}
