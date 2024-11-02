<?php

namespace Helpdesk\Factories;

use Helpdesk\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    public static array $names = [
        'Onboarding Experts',
        'Client Relations',
        'Account Management',
        'Product Guidance Team',
        'Technical Support',
    ];

    protected $model = Group::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement(self::$names),
        ];
    }
}
