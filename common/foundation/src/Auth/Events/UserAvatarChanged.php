<?php

namespace Common\Auth\Events;

use App\Models\User;

class UserAvatarChanged
{
    public function __construct(public User $user)
    {
    }
}
