<?php

namespace Helpdesk\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait CanBeAgent
{
    public function isSuperAdmin(): bool
    {
        return $this->hasPermission('superAdmin') ||
            $this->hasPermission('admin');
    }

    public function isAgent(): bool
    {
        return $this->isSuperAdmin() ||
            $this->hasPermission('tickets.update') ||
            $this->hasPermission('chats.update') ||
            $this->roles->contains('name', 'agent');
    }

    public function agentSettings(): HasOne
    {
        return $this->hasOne(AgentSettings::class);
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user');
    }

    public function scopeWhereAgent(Builder $query): Builder
    {
        return $query
            ->whereHas(
                'permissions',
                fn(Builder $query) => $query
                    ->whereIn('name', [
                        'conversations.update',
                        'tickets.update',
                        'admin',
                    ])
                    ->orWhere('name', 'admin'),
            )
            ->orWhereHas(
                'roles',
                fn(Builder $query) => $query->whereHas(
                    'permissions',
                    fn(Builder $query) => $query->whereIn('name', [
                        'conversations.update',
                        'tickets.update',
                        'admin',
                    ]),
                ),
            );
    }

    public function toCompactAgentArray(): array
    {
        if ($this->hasPermission('admin')) {
            $role = ['name' => 'super admin'];
        } elseif ($this->roles->first()) {
            $role = [
                'id' => $this->roles->first()->id,
                'name' => $this->roles->first()->name,
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->email,
            'image' => $this->image,
            'role' => $role ?? null,
            'model_type' => $this::MODEL_TYPE,
        ];
    }
}
