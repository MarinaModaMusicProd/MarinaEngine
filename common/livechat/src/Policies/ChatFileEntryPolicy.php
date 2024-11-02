<?php

namespace Livechat\Policies;

use App\Models\User;
use Common\Files\FileEntry;
use Illuminate\Support\Facades\DB;
use Livechat\Models\ChatMessage;
use Livechat\Models\ChatVisitor;

class ChatFileEntryPolicy
{
    public function show(?User $user, FileEntry $entry): bool
    {
        return $this->hasPermissionViaTicket($user, $entry);
    }

    public function download(?User $user, $entries): bool
    {
        return $this->hasPermissionViaTicket($user, $entries[0]);
    }

    private function hasPermissionViaTicket(?User $user, FileEntry $entry): bool
    {
        $fileEntryModel = DB::table('file_entry_models')
            ->where('file_entry_id', $entry->id)
            ->where('model_type', ChatMessage::MODEL_TYPE)
            ->first();

        if (!is_null($fileEntryModel)) {
            $chat = ChatMessage::with(['chat'])->find($fileEntryModel->model_id)
                ->chat;

            if (!$chat) {
                return false;
            }

            // chat is attached to user
            if ($user?->id && $chat->user_id && $chat->user_id === $user->id) {
                return true;
            }

            if ($chat->visitor_id) {
                $visitor = ChatVisitor::getForCurrentRequest();
                if ($visitor && $visitor->id === $chat->visitor_id) {
                    return true;
                }
            }

            return false;
        }
    }
}
