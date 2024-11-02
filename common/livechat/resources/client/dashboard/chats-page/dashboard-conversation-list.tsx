import {Chat, ChatMessage} from '@livechat/widget/chat/chat';
import {FormattedRelativeTime} from '@ui/i18n/formatted-relative-time';
import {Trans} from '@ui/i18n/trans';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {getChatStatusColor} from '@livechat/dashboard/chats-page/visitor-sidebar/recent-chats-panel';
import React from 'react';

interface Props {
  conversations: Chat[];
  onSelected: (chat: Chat) => void;
}
export function DashboardConversationList({conversations, onSelected}: Props) {
  return (
    <div className="space-y-8">
      {conversations.map(chat => {
        const message = chat.last_message as ChatMessage | undefined;
        if (!message) {
          return null;
        }
        const startedAt = (
          <FormattedRelativeTime date={chat.created_at} style="long" />
        );
        return (
          <div
            key={chat.id}
            className="-mx-12 cursor-pointer rounded-panel p-12 transition-button hover:bg-hover"
            onClick={() => onSelected(chat)}
          >
            <div className="mb-6 flex items-end justify-between gap-8">
              <div className="text-xs font-medium">
                <Trans message="Started :time" values={{time: startedAt}} />
              </div>
              <Chip color={getChatStatusColor(chat.status)} size="xs">
                <Trans message={chat.status} />
              </Chip>
            </div>
            <div className="flex items-end justify-between gap-14 text-xs text-muted">
              <div className="min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {message.body}
              </div>
              <div className="flex-shrink-0 whitespace-nowrap">
                <FormattedRelativeTime
                  date={message.created_at}
                  style="narrow"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
