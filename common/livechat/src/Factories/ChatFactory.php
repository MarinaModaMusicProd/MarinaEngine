<?php

namespace Livechat\Factories;

use App\Models\User;
use Helpdesk\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;
use Livechat\Models\Chat;
use Livechat\Models\ChatVisitor;

class ChatFactory extends Factory
{
    protected $model = Chat::class;

    public function active(): Factory
    {
        return $this->state(function (array $attributes) {
            $date = $this->faker->dateTimeBetween(now()->subMinutes(50), now());
            return [
                'status' => Chat::STATUS_OPEN,
                'created_at' => $date,
                'updated_at' => $date,
                'assigned_to' => User::factory(),
                'visitor_id' => ChatVisitor::factory([
                    'is_crawler' => false,
                    'last_active_at' => $date,
                ]),
            ];
        });
    }

    public function idle(): Factory
    {
        return $this->state(function (array $attributes) {
            $date = $this->faker->dateTimeBetween(now()->subHours(2), now());
            return [
                'status' => Chat::STATUS_IDLE,
                'created_at' => $date,
                'updated_at' => $date,
                'assigned_to' => User::factory(),
                'visitor_id' => ChatVisitor::factory([
                    'is_crawler' => false,
                    'last_active_at' => $date,
                ]),
            ];
        });
    }

    public function queued(): Factory
    {
        return $this->state(function (array $attributes) {
            $date = $this->faker->dateTimeBetween(now()->subHours(3), now());
            return [
                'status' => Chat::STATUS_QUEUED,
                'created_at' => $date,
                'updated_at' => $date,
                'assigned_to' => null,
                'visitor_id' => ChatVisitor::factory([
                    'is_crawler' => false,
                    'last_active_at' => $date,
                ]),
            ];
        });
    }

    public function unassigned(): Factory
    {
        return $this->state(function (array $attributes) {
            $date = $this->faker->dateTimeBetween(now()->subHours(8), now());
            return [
                'status' => Chat::STATUS_UNASSIGNED,
                'created_at' => $date,
                'updated_at' => $date,
                'assigned_to' => null,
                'visitor_id' => ChatVisitor::factory([
                    'is_crawler' => false,
                    'last_active_at' => $date,
                ]),
            ];
        });
    }

    public function closed(): Factory
    {
        return $this->state(function (array $attributes) {
            $date = $this->faker->dateTimeBetween(now()->subMonth(), now());
            $isAssigned = $this->faker->boolean(70);
            return [
                'status' => Chat::STATUS_CLOSED,
                'created_at' => $date,
                'updated_at' => $date,
                'assigned_to' => $isAssigned ? User::factory() : null,
                'visitor_id' => ChatVisitor::factory([
                    'is_crawler' => false,
                    'last_active_at' => $date,
                ]),
            ];
        });
    }

    public function definition(): array
    {
        return [
            'status' => Chat::STATUS_CLOSED,
            'type' => Chat::MODEL_TYPE,
            'group_id' => Group::factory(),
        ];
    }
}
