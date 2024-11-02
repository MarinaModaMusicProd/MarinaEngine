<?php

namespace Livechat\Controllers;

use Common\Core\BaseController;
use Livechat\Events\ChatVisitCreated;
use Livechat\Models\ChatVisit;
use Livechat\Models\ChatVisitor;

class ChatVisitsController extends BaseController
{
    public function index(int $visitorId)
    {
        $visitor = ChatVisitor::findOrFail($visitorId);

        $this->authorize('index', [ChatVisit::class, $visitor]);

        return [
            'visits' => $visitor->getLatestVisits(),
        ];
    }

    public function store(int $visitorId)
    {
        $visitor = ChatVisitor::findOrFail($visitorId);
        $this->authorize('store', [ChatVisit::class, $visitor]);

        $data = request()->validate([
            'url' => 'required',
            'title' => 'required',
            'referrer' => 'nullable|string',
            'started_at' => 'required|date',
        ]);

        $lastVisit = $visitor->getLastVisit();

        // if it's a visit for the same url, and it's less than 5
        // seconds since the last visit, don't create a new visit
        if (
            $lastVisit &&
            $lastVisit->url === $data['url'] &&
            $lastVisit->created_at->diffInSeconds(now()) < 5
        ) {
            return $this->success(['visit' => $lastVisit]);
        }

        $visit = $visitor->visits()->create([
            'url' => $data['url'],
            'title' => $data['title'] ?? null,
            'chat_id' => $data['chat_id'] ?? null,
            'referrer' => $data['referrer'] ?? ($lastVisit['url'] ?? null),
            'created_at' => $data['started_at'],
        ]);

        event(new ChatVisitCreated($visit));

        $visitor->updateLastActiveDate();

        $visitor->update([
            'last_active_at' => now(),
            'visits_count' => $visitor->visits_count + 1,
            // let's assume user will be active on each visit at least 5 seconds
            'time_on_all_pages' => $visitor->time_on_all_pages + 5000,
        ]);

        return $this->success(['visit' => $visit]);
    }

    public function changeStatus(int $visitId)
    {
        $visit = ChatVisit::findOrFail($visitId);
        $this->authorize('update', $visit);

        // data will be sent via beacon API, need get it from raw post data
        $data = json_decode(request()->getContent(), true);

        if ($data['status'] === 'ended') {
            $visit->update([
                'ended_at' => now(),
            ]);
            $visit->visitor()->update([
                'time_on_all_pages' =>
                    $visit->visitor->time_on_all_pages +
                    $visit->ended_at->diffInMilliseconds($visit->created_at),
            ]);
        } else {
            $visit->update([
                'ended_at' => null,
            ]);
        }

        return $this->success();
    }
}
