<?php

namespace Helpdesk\Seeders;

use App\Models\User;
use Helpdesk\Models\Group;

class DefaultGroupSeeder
{
    public function execute(): void
    {
        if (!Group::where('default')->exists()) {
            $group = Group::create([
                'name' => 'General',
                'default' => true,
            ]);

            $admin = User::findAdmin();
            if ($admin) {
                $group->users()->attach($admin, [
                    'created_at' => now(),
                ]);
            }
        }
    }
}
