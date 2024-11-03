<?php

namespace Common\HelpDesk\HelpCenter\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait FiltersByVisibleToRole
{
    public function scopeFilterByVisibleToRole(Builder $query): Builder
    {
        return $query->where(function (Builder $query) {
            $query
                ->whereNull('visible_to_role')
                ->when(
                    Auth::user(),
                    fn($q) => $q->orWhereIn(
                        'visible_to_role',
                        Auth::user()?->roles->pluck('id'),
                    ),
                    fn($q) => $q->orWhere(
                        'visible_to_role',
                        app('guestRole')->id,
                    ),
                );
        });
    }
}
