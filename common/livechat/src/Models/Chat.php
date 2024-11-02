<?php

namespace Livechat\Models;

use App\Models\User;
use Helpdesk\Models\Conversation;
use Helpdesk\Models\ConversationItem;
use Helpdesk\Models\Group;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Livechat\Actions\DistributeActiveChatsToAvailableAgents;
use Livechat\Events\ChatMessageCreated;
use Livechat\Factories\ChatFactory;

class Chat extends Conversation
{
    use HasFactory;

    const MODEL_TYPE = 'chat';
    const CONTENT_MODEL_TYPE = ChatMessage::MODEL_TYPE;

    // agent is actively chatting with visitor
    const STATUS_OPEN = parent::STATUS_OPEN;
    // agent is chatting with visitor, but visitor is not responding for some time
    const STATUS_IDLE = parent::STATUS_PENDING;
    // chat is closed and archived
    const STATUS_CLOSED = parent::STATUS_CLOSED;
    // all agents are busy or auto assigning is disabled, waiting for agent to pick chat from queue
    const STATUS_QUEUED = 'queued';
    // chat was started while no agents were online or from different channel then chat widget
    const STATUS_UNASSIGNED = 'unassigned';

    const EVENT_VISITOR_STARTED_CHAT = 'visitor.startedChat';
    const EVENT_CLOSED_INACTIVITY = 'closed.inactivity';
    const EVENT_CLOSED_BY_AGENT = 'closed.byAgent';
    const EVENT_VISITOR_IDLE = 'visitor.idle';
    const EVENT_VISITOR_LEFT_CHAT = 'visitor.leftChat';
    const EVENT_AGENT_LEFT_CHAT = 'agent.leftChat';
    const EVENT_AGENT_CHANGED = 'agent.changed';
    const EVENT_GROUP_CHANGED = 'group.changed';

    protected $hidden = ['last_message_id', 'subject', 'received_at_email'];

    protected $attributes = [
        'type' => self::MODEL_TYPE,
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'last_message_id');
    }

    public function lastEvent(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'last_event_id');
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(ChatVisitor::class, 'visitor_id');
    }

    public function visits(): HasMany
    {
        return $this->hasMany(ChatVisit::class);
    }

    public function summary(): HasOne
    {
        return $this->hasOne(ConversationSummary::class);
    }

    public static function changeStatus(
        string $status,
        iterable $conversations,
        bool $fireEvent = true,
    ): iterable {
        $conversations = parent::changeStatus(
            $status,
            $conversations,
            $fireEvent,
        );

        if ($status === Chat::STATUS_CLOSED) {
            foreach ($conversations as $conversation) {
                $conversation->createClosedByAgentEvent(auth()->user());
            }

            // if chat is closed, run chat distribution cycle
            (new DistributeActiveChatsToAvailableAgents())->execute();
        }

        return $conversations;
    }

    public function createNote(array $data): ConversationItem
    {
        $chatMessage = $this->createMessage(
            [
                'body' => $data['body'],
                'author' => 'agent',
                'user_id' => $data['user_id'] ?? Auth::id(),
                'type' => 'note',
            ],
            [
                'status' => Chat::STATUS_OPEN,
            ],
        );

        event(new ChatMessageCreated($this, $chatMessage));
    }

    public function truncateLastMessage(): static
    {
        if (
            $this->exists() &&
            $this->relationLoaded('lastMessage') &&
            $this->last_message
        ) {
            $this->last_message->content = Str::limit(
                $this->last_message->content,
                200,
            );
        }
        return $this;
    }

    public function createVisitorLeftChatEvent(): ChatMessage
    {
        return $this->createEvent(Chat::EVENT_VISITOR_LEFT_CHAT, [
            'status' => $this->status,
        ]);
    }

    public function createAgentLeftChatEvent(
        User|array $oldAgent = null,
        User|array $newAgent = null,
    ): ChatMessage {
        $data = ['status' => $this->status];
        if (isset($oldAgent['id'])) {
            $data['oldAgentId'] = $oldAgent['id'];
        }
        if (isset($newAgent['id'])) {
            $data['newAgentId'] = $newAgent['id'];
        }
        return $this->createEvent(Chat::EVENT_AGENT_LEFT_CHAT, $data);
    }

    public function createVisitorIdleEvent(): ChatMessage
    {
        return $this->createEvent(Chat::EVENT_VISITOR_IDLE);
    }

    public function createClosedDueToInactivityEvent(): ChatMessage
    {
        $this->update(['status' => Chat::STATUS_CLOSED]);
        return $this->createEvent(Chat::EVENT_CLOSED_INACTIVITY);
    }

    public function createAgentChangedEvent(User|array $newAgent): ChatMessage
    {
        return $this->createEvent(Chat::EVENT_AGENT_CHANGED, [
            'newAgent' => $newAgent['name'],
        ]);
    }

    public function createGroupChangedEvent(Group|array $newGroup): ChatMessage
    {
        return $this->createEvent(Chat::EVENT_GROUP_CHANGED, [
            'newGroup' => $newGroup['name'],
        ]);
    }

    public function createVisitorStartedChatEvent(): ChatMessage
    {
        return $this->createEvent(Chat::EVENT_VISITOR_STARTED_CHAT);
    }

    public function createClosedByAgentEvent(User|array $closedBy): ChatMessage
    {
        return $this->createEvent(Chat::EVENT_CLOSED_BY_AGENT, [
            'closedBy' => $closedBy['name'],
        ]);
    }

    public function createEvent(string $name, array $data = []): ChatMessage
    {
        $data['name'] = $name;
        return $this->createMessage([
            'type' => 'event',
            'body' => $data,
            'author' => 'system',
            'created_at' => $data['created_at'] ?? now(),
            'updated_at' => $data['updated_at'] ?? now(),
        ]);
    }

    public function storePreChatFormData(array $data): ChatMessage
    {
        $visitorData = collect($data)
            ->mapWithKeys(fn($item) => [$item['name'] => $item['value']])
            ->filter(
                fn($value, $name) => $name === 'email' || $name === 'name',
            );
        if ($visitorData->isNotEmpty()) {
            $this->visitor()->update($visitorData->toArray());
        }

        return $this->createMessage([
            'type' => 'preChatFormData',
            'body' => $data,
            'author' => 'visitor',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function createMessage(
        array $data,
        array $chatData = [],
    ): ChatMessage {
        $isInitialMessage = $this->last_message_id === null;
        $message = $this->messages()->create([
            'body' => $data['body'],
            'type' => $data['type'] ?? 'message',
            'author' => $data['author'] ?? 'visitor',
            'user_id' =>
                $data['author'] !== 'visitor' &&
                $isInitialMessage &&
                $this->assigned_to
                    ? $this->assigned_to
                    : Auth::id(),
            'created_at' => $data['created_at'] ?? now(),
            'updated_at' => $data['updated_at'] ?? now(),
        ]);

        if (isset($data['fileEntryIds'])) {
            $message->attachments()->attach($data['fileEntryIds']);
        }

        if ($message->type === 'message') {
            $chatData['last_message_id'] = $message->id;
        } elseif ($message->type === 'event') {
            $chatData['last_event_id'] = $message->id;
        }

        $this->update($chatData);

        return $message;
    }

    public function scopeWhereCountry(
        Builder $builder,
        string $country,
    ): Builder {
        return $builder->whereHas('visitor', function (Builder $q) use (
            $country,
        ) {
            $q->where('country', $country);
        });
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'messages' => $this->messages
                ->filter(
                    fn(ChatMessage $message) => $message->type === 'message',
                )
                ->map(fn(ChatMessage $message) => $message->toSearchableArray())
                ->slice(0, 50),
            'tags' => $this->tags->pluck('id'),
            'user' => $this->user ? $this->user->toSearchableArray() : null,
            'user_id' => $this->user ? $this->user->id : null,
            'group' => $this->group ? $this->group->toSearchableArray() : null,
            'group_id' => $this->group ? $this->group->id : null,
            'country' => $this->user?->country ?? $this->visitor?->country,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'closed_at' => $this->closed_at->timestamp ?? '_null',
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public function makeSearchableUsing(Collection $models)
    {
        return $models->load([
            'visitor',
            'user',
            'group',
            'messages' => fn(HasMany $builder) => $builder->where(
                'type',
                'message',
            ),
            'tags',
        ]);
    }

    protected function makeAllSearchableUsing($query)
    {
        return $query->with([
            'visitor',
            'user',
            'group',
            'messages' => fn(HasMany $builder) => $builder->where(
                'type',
                'message',
            ),
            'tags',
        ]);
    }

    public static function filterableFields(): array
    {
        return array_merge(parent::filterableFields(), ['country']);
    }

    protected static function newFactory(): Factory
    {
        return ChatFactory::new();
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
