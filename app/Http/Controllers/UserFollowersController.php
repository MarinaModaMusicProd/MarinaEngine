<?php namespace App\Http\Controllers;

use App\User;
use Auth;
use Common\Core\BaseController;
use Illuminate\Http\Request;

class UserFollowersController extends BaseController {

    public function __construct(protected User $user, protected Request $request)
    {
    }

    public function index(User $user)
    {
        $this->authorize('show', $user);

        $pagination = $user
            ->followers()
            ->withCount(['followers'])
            ->simplePaginate(request('perPage') ?? 20);

        return $this->success(['pagination' => $pagination]);
    }

    public function follow(int $id)
    {
        $this->middleware('auth');

        $user = $this->user->findOrFail($id);

        if ($user->id !== Auth::user()->id) {
            Auth::user()->followedUsers()->sync([$id], false);
        }

        return $this->success();
    }

    public function unfollow(int $id)
    {
        $this->middleware('auth');

        $user = $this->user->findOrFail($id);

        if ($user->id != Auth::user()->id) {
            Auth::user()->followedUsers()->detach($id);
        }

        return $this->success();
    }
}
