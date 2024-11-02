<?php namespace Helpdesk\Controllers;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Common\Tags\Tag;
use Helpdesk\Models\CannedReply;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CannedRepliesController extends BaseController
{
    public function index()
    {
        $this->authorize('index', CannedReply::class);

        $builder = CannedReply::with(['attachments', 'tags']);

        if (request('with') === 'user') {
            $builder->with('user');
        }

        if ($userId = request('forUser')) {
            $builder->where('user_id', $userId);

            $builder->orWhere(function($query) {
                $userGroupIds = Auth::user()->groups->pluck('id')->toArray();
                $query->whereIn('group_id', $userGroupIds)->where('shared', true);
            });
        }

        $pagination = (new Datasource($builder, request()->all()))->paginate();

        return $this->success(['pagination' => $pagination]);
    }

    public function show(int $replyId)
    {
        $reply = CannedReply::with(['attachments', 'tags'])->findOrFail($replyId);

        $this->authorize('show', $reply);

        return $this->success(['reply' => $reply]);
    }

    public function store()
    {
        $this->authorize('store', CannedReply::class);

        $userId = Auth::id();

        $data = $this->validate(request(), [
            'body' => 'required|string|min:3',
            'shared' => 'required|boolean',
            'name' => "required|string|min:3|max:255|unique:canned_replies,name,NULL,id,user_id,
                $userId",
            'groupId' => 'int|exists:groups,id',
            'attachments' => 'array|max:5|exists:file_entries,id',
            'tags' => 'array|max:10',
            'tags.*' => 'string',
        ]);

        $cannedReply = CannedReply::create([
            'body' => $data['body'],
            'name' => $data['name'],
            'shared' => $data['shared'],
            'user_id' => $userId,
            'group_id' => $data['groupId'] ?? null,
        ]);

        if ($attachments = request('attachments')) {
            $cannedReply->attachments()->sync($attachments);
        }

        if ($tagNames = request('tags')) {
            $tags = app(Tag::class)->insertOrRetrieve($tagNames);
            $cannedReply->tags()->sync($tags->pluck('id'));
        }

        return $this->success(['cannedReply' => $cannedReply], 201);
    }

    public function update(int $id)
    {
        $cannedReply = CannedReply::findOrFail($id);

        $this->authorize('update', $cannedReply);

        $userId = Auth::id();

        $data = $this->validate(request(), [
            'body' => 'required|string|min:3',
            'shared' => 'boolean',
            'name' => "required|string|min:3|max:255|unique:canned_replies,name,$id,id,user_id,$userId",
            'attachments' => 'array|max:5|exists:file_entries,id',
            'groupId' => 'int|exists:groups,id',
            'tags' => 'array|max:10',
            'tags.*' => 'string',
        ]);

        $cannedReply
            ->fill([
                'body' => $data['body'],
                'name' => $data['name'],
                'shared' => $data['shared'],
                'group_id' => $data['groupId'] ?? null,
            ])
            ->save();

        if ($attachments = request('attachments')) {
            $cannedReply->attachments()->sync($attachments);
        }

        if ($tagNames = request('tags')) {
            $tags = app(Tag::class)->insertOrRetrieve($tagNames);
            $cannedReply->tags()->sync($tags->pluck('id'));
        }

        return $this->success(['cannedReply' => $cannedReply]);
    }

    public function destroy(string $ids)
    {
        $replyIds = explode(',', $ids);
        $this->authorize('destroy', CannedReply::class);

        // detach attachments from canned replies
        DB::table('file_entry_models')
            ->where('model_type', CannedReply::MODEL_TYPE)
            ->whereIn('model_id', $replyIds)
            ->delete();

        CannedReply::whereIn('id', $replyIds)->delete();

        return $this->success();
    }
}
