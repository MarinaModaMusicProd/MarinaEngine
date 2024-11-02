<?php

namespace Livechat\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversationSummary extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'content' => 'array',
        'generated_by' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
