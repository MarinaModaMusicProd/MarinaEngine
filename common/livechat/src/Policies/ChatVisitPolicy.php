<?php

namespace Livechat\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Livechat\Actions\MakeCurrentVisitorIdentifier;
use Livechat\Models\ChatVisit;
use Livechat\Models\ChatVisitor;

class ChatVisitPolicy
{
    public function index(?User $user, ChatVisitor $visitor): bool|Response
    {
        if ($user->isAgent()) {
            return true;
        }
        $identifier = (new MakeCurrentVisitorIdentifier())->execute();
        return $visitor->user_identifier === $identifier;
    }

    public function store(?User $user, ChatVisitor $visitor): bool|Response
    {
        if ($user->isAgent()) {
            return true;
        }
        $identifier = (new MakeCurrentVisitorIdentifier())->execute();
        return $visitor->user_identifier === $identifier;
    }

    public function update(?User $user, ChatVisit $visit): bool|Response
    {
        if ($user->isAgent()) {
            return true;
        }
        $identifier = (new MakeCurrentVisitorIdentifier())->execute();
        return $visit->visitor->user_identifier === $identifier;
    }
}
