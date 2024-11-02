<?php

namespace Livechat\Models;

use App\Models\User;
use Common\Auth\Traits\Bannable;
use Common\Core\BaseModel;
use Helpdesk\Models\Group;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Jenssegers\Agent\Agent;
use Livechat\Actions\GetWidgetChatData;
use Livechat\Actions\MakeCurrentVisitorIdentifier;
use Livechat\Events\ChatVisitorCreated;
use Livechat\Factories\ChatVisitorFactory;

class ChatVisitor extends BaseModel
{
    use HasFactory, Bannable;

    const MODEL_TYPE = 'chatVisitor';

    protected $guarded = ['id'];

    protected $casts = [
        'time_on_all_pages' => 'int',
        'chat_created_at' => 'datetime',
    ];

    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class, 'visitor_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chat_assigned_to');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'chat_group_id');
    }

    public function visits(): HasMany
    {
        return $this->hasMany(ChatVisit::class, 'visitor_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeCompact(Builder $query): Builder
    {
        return $query->select(['id', 'email', 'name']);
    }

    public function updateLastActiveDate(): void
    {
        if ($this->exists()) {
            $this->last_active_at = now();
            $this->save();
        }
    }

    public static function getOrCreateForCurrentRequest()
    {
        $visitor = static::getForCurrentRequest();
        if (!$visitor) {
            $ip = getIp();
            $geo = geoip($ip);
            $resolver = app(Agent::class);
            $visitor = static::create([
                'user_identifier' => (new MakeCurrentVisitorIdentifier())->execute(),
                'user_ip' => $ip,
                'country' => $geo['iso_code'],
                'city' => $geo['city'],
                'state' => $geo['state'],
                'timezone' => $geo['timezone'],
                'browser' => $resolver->browser(),
                'platform' => $resolver->platform(),
                'device' => $resolver->deviceType(),
                'is_crawler' => $resolver->isRobot(),
                'user_agent' => $resolver->getUserAgent(),
                'last_active_at' => now(),
            ]);
            event(new ChatVisitorCreated($visitor));
        }
        return $visitor;
    }

    public static function getForCurrentRequest(): self|null
    {
        $identifier = (new MakeCurrentVisitorIdentifier())->execute();
        return static::where('user_identifier', $identifier)->first();
    }

    public function getLastVisit(): ChatVisit|null
    {
        return $this->visits()
            ->orderBy('created_at', 'desc')
            ->first();
    }

    public function getLatestVisits()
    {
        return $this->visits()
            ->latest()
            ->limit(8)
            ->get();
    }

    public function getAuthIdentifierForBroadcasting(): string
    {
        return $this->user_identifier;
    }

    protected function data(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) {
                    return (object) [];
                }
                if (is_string($value)) {
                    return json_decode($value, true);
                }
                return $value;
            },
            set: function ($value) {
                if (is_array($value)) {
                    $this->attributes['data'] = json_encode($value);
                } else {
                    $this->attributes['data'] = $value;
                }
            },
        );
    }

    public static function mostRecentChatForCurrentRequest(): array|null
    {
        $visitor = static::getOrCreateForCurrentRequest()->loadCount('chats');
        $chat = $visitor
            ->chats()
            ->where('status', '!=', Chat::STATUS_CLOSED)
            ->latest()
            ->first();

        $data = ['visitor' => $visitor];

        if ($chat) {
            $data = array_merge(
                $data,
                (new GetWidgetChatData())->execute($chat),
            );
        }

        return $data;
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'country' => $this->country,
            'city' => $this->city,
            'state' => $this->state,
            'timezone' => $this->timezone,
            'browser' => $this->browser,
            'platform' => $this->platform,
            'device' => $this->device,
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    protected static function newFactory(): Factory
    {
        return ChatVisitorFactory::new();
    }

    public static function filterableFields(): array
    {
        return [
            'id',
            'country',
            'city',
            'state',
            'timezone',
            'browser',
            'platform',
            'device',
            'created_at',
            'updated_at',
        ];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' =>
                $this->name ?: $this->email ?: $this->user_ip ?: __('Visitor'),
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
