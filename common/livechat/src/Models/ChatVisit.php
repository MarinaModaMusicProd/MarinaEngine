<?php

namespace Livechat\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Livechat\Factories\ChatVisitFactory;

class ChatVisit extends Model
{
    use HasFactory;

    const MODEL_TYPE = 'chatVisit';

    public $timestamps = false;

    protected $guarded = ['id'];

    protected $casts = [
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(ChatVisitor::class, 'visitor_id');
    }

    protected static function newFactory(): Factory
    {
        return ChatVisitFactory::new();
    }
}
