<?php namespace Helpdesk\Policies;

use App\Models\User;
use Common\Core\Policies\BasePolicy;
use Helpdesk\Models\HcArticle;
use Helpdesk\Models\HcCategory;

class HcArticlePolicy extends BasePolicy
{
    public function index(?User $user)
    {
        return $this->hasPermission($user, 'articles.view');
    }

    public function show(?User $user)
    {
        return $this->hasPermission($user, 'articles.view');
    }

    public function store(User $user)
    {
        return $this->hasPermission($user, 'articles.create');
    }

    public function update(
        User $user,
        HcArticle|HcCategory $articleOrCategory = null,
    ) {
        return $this->hasPermission($user, 'articles.update') ||
            ($articleOrCategory &&
                $user->roles
                    ->pluck('id')
                    ->contains($articleOrCategory->managed_by_role));
    }

    public function destroy(User $user)
    {
        return $this->hasPermission($user, 'articles.delete');
    }
}
