<?php

namespace Livechat\Actions;

use App\Models\User;
use Common\Websockets\API\WebsocketAPI;
use Helpdesk\Websockets\HelpDeskChannel;
use Illuminate\Support\Collection;

class AgentsLoader
{
    public function getAllAgents(): Collection
    {
        return User::whereAgent()
            ->with(['agentSettings', 'groups'])
            ->withCount('activeAssignedChats')
            ->get()
            ->map(function (User $agent) {
                $acceptsChats = $this->agentAcceptsChats($agent);
                return [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'image' => $agent->image,
                    'acceptsChats' => $acceptsChats,
                    'activeAssignedChatsCount' =>
                        $agent->active_assigned_chats_count,
                    'groups' => $agent->groups->map->only(['id', 'name']),
                ];
            });
    }

    public function getCurrentlyOnlineAgents(): Collection
    {
        $onlineUsers = app(WebsocketAPI::class)->getActiveUsersInChannel(
            HelpDeskChannel::NAME,
        );

        return $this->getAllAgents()->filter(
            fn($agent) => $onlineUsers->contains($agent['id']),
        );
    }

    protected function agentAcceptsChats(User $agent): bool
    {
        if (!$agent->agentSettings) {
            return false;
        }

        // not accepting chats at all
        if ($agent->agentSettings->accepts_chats === 'no') {
            return false;
        }

        // over chat limit
        if (
            $agent->agentSettings->chat_limit <=
            $agent->active_assigned_chats_count
        ) {
            return false;
        }

        // working hours
        if (
            $agent->agentSettings->accepts_chats === 'workingHours' &&
            $agent->agentSettings->working_hours
        ) {
            $hours =
                $agent->agentSettings->working_hours[now()->weekday()] ?? null;

            // if hours for this day are not set at all or
            // current time is outside the range, return false
            if ($hours && isset($hours['from']) && isset($hours['to'])) {
                $start = now()->setTimeFromTimeString($hours['from']);
                $end = now()->setTimeFromTimeString($hours['to']);

                if (!now()->between($start, $end)) {
                    return true;
                }
            }

            return false;
        }

        return true;
    }
}
