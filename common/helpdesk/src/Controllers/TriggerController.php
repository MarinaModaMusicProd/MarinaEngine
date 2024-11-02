<?php namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Helpdesk\Models\Trigger;
use Helpdesk\Requests\ModifyTrigger;
use Helpdesk\Triggers\LoadTriggerConfig;
use Illuminate\Support\Facades\Auth;

class TriggerController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Trigger::class);

        $datasource = new Datasource(Trigger::query(), request()->all());

        return $this->success(['pagination' => $datasource->paginate()]);
    }

    public function show(Trigger $trigger)
    {
        $this->authorize('index', $trigger);

        return $this->success(['trigger' => $trigger]);
    }

    public function store(ModifyTrigger $request)
    {
        $this->authorize('store', Trigger::class);
        $data = $request->validated();

        $trigger = Trigger::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'times_fired' => $data['times_fired'] ?? 0,
            'user_id' => Auth::id(),
            'config' => [
                'conditions' => $data['conditions'],
                'actions' => $data['actions'],
            ]
        ]);

        return $this->success(['trigger' => $trigger]);
    }

    public function update(Trigger $trigger, ModifyTrigger $request)
    {
        $this->authorize('update', $trigger);
        $data = $request->validated();

        $trigger->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'config' => [
                'conditions' => $data['conditions'],
                'actions' => $data['actions'],
            ],
        ]);

        return $this->success(['trigger' => $trigger]);
    }

    public function destroy(string $ids)
    {
        $ids = explode(',', $ids);
        $this->authorize('destroy', Trigger::class);

        Trigger::whereIn('id', $ids)->delete();

        return response(null, 204);
    }

    public function config()
    {
        $this->authorize('store', Trigger::class);

        return $this->success((new LoadTriggerConfig())->execute());
    }
}
