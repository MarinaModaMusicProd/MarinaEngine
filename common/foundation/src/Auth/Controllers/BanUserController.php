<?php

namespace Common\Auth\Controllers;

use App\Models\User;
use Common\Core\BaseController;
use Illuminate\Support\Facades\Auth;

class BanUserController extends BaseController
{
    public function store(User $user)
    {
        $data = $this->validate(request(), [
            'ban_until' => 'nullable|date|after:now',
            'comment' => 'nullable|string|max:255',
            'permanent' => 'boolean',
        ]);

        $this->authorize('destroy', [$user::class, [$user->id]]);

        if ($user->hasPermission('admin')) {
            abort(403, 'Admin users can\'t be suspended');
        }

        if ($user->id === Auth::id()) {
            abort(403, 'You can\'t suspend yourself');
        }

        $user->createBan($data);

        return $this->success(['user' => $user]);
    }

    public function destroy(User $user)
    {
        $this->authorize('destroy', [$user::class, [$user->id]]);

        $user->unban();

        return $this->success(['user' => $user]);
    }
}
