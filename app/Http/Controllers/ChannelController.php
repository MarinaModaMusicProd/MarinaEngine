<?php

namespace App\Http\Controllers;

use App\Actions\Channel\CrupdateChannel;
use App\Actions\Channel\UpdateChannelContent;
use App\Channel;
use App\Http\Requests\CrupdateChannelRequest;
use Carbon\Carbon;
use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ChannelController extends BaseController
{
    public function index(): Response
    {
        $userId = request()->get('userId');
        $this->authorize('index', [Channel::class, $userId]);

        $builder = Channel::query();

        if ($userId = request()->get('userId')) {
            $builder->where('user_id', $userId);
        }

        if ($channelIds = request()->get('channelIds')) {
            $builder->whereIn('id', explode(',', $channelIds));
        }

        $paginator = new Datasource($builder, request()->all());

        $pagination = $paginator->paginate();

        return $this->success(['pagination' => $pagination]);
    }

    public function show(Channel $channel): Response
    {
        $this->authorize('show', $channel);

        $channel->loadContent(request()->all());

        if (request()->get('returnContentOnly')) {
            return response()->json(['pagination' => $channel->content]);
        } else {
            return $this->success(['channel' => $channel->toArray()]);
        }
    }

    public function store(CrupdateChannelRequest $request): Response
    {
        $this->authorize('store', Channel::class);

        $channel = app(CrupdateChannel::class)->execute($request->all());

        return $this->success(['channel' => $channel]);
    }

    public function update(
        Channel $channel,
        CrupdateChannelRequest $request
    ): Response {
        $this->authorize('store', $channel);

        $channel = app(CrupdateChannel::class)->execute(
            $request->all(),
            $channel,
        );

        return $this->success(['channel' => $channel]);
    }

    public function destroy(Collection $channels): Response
    {
        $channels = $channels->filter(function (Channel $channel) {
            return !Arr::get($channel->config, 'preventDeletion');
        });

        $channelsToDelete = $channels->pluck('id');
        $this->authorize('destroy', [Channel::class, $channelsToDelete]);

        // touch all channels that have channels we're deleting
        // nested so cache for them is cleared properly
        $parentChannelIds = DB::table('channelables')
            ->where('channelable_type', Channel::class)
            ->whereIn('channelable_id', $channelsToDelete)
            ->pluck('channel_id');
        Channel::whereIn('id', $parentChannelIds)
            ->update(['updated_at' => Carbon::now()]);

        DB::table('channelables')
            ->whereIn('channel_id', $channelsToDelete)
            ->delete();
        Channel::whereIn('id', $channelsToDelete)->delete();

        return $this->success();
    }

    public function updateContent(Channel $channel)
    {
        $this->authorize('update', $channel);

        if ($autoUpdateMethod = request('autoUpdateMethod')) {
            $config = $channel->config;
            $config['autoUpdateMethod'] = $autoUpdateMethod;
            $channel->fill(['config' => $config])->save();
        }

        app(UpdateChannelContent::class)->execute($channel, );
        $channel->loadContent(request()->all());

        return $this->success([
            'channel' => $channel,
        ]);
    }
}
