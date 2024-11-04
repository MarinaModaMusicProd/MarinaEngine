import {Chat, ChatMessage} from '@livechat/widget/chat/chat';
import {useRecentChats} from '@livechat/dashboard/chats-page/visitor-sidebar/use-recent-chats';
import {ProgressCircle} from '@ui/progress/progress-circle';
import React from 'react';
import {Trans} from '@ui/i18n/trans';
import {FormattedRelativeTime} from '@ui/i18n/formatted-relative-time';
import {Chip, ChipProps} from '@ui/forms/input-field/chip-field/chip';

interface Props {
  visitorId: number | string;
  initialData?: Chat[];
  onChatSelected: (chat: Chat) => void;
}
export function RecentChatsPanel({
  visitorId,
  initialData,
  onChatSelected,
}: Props) {
  const {data} = useRecentChats(visitorId, initialData);

  if (!data) {
    return (
      <div className="flex justify-center">
        <ProgressCircle isIndeterminate size="xs" />
      </div>
    );
  }

  if (!data.chats.length) {
    return (
      <div className="font-italic text-xs text-muted">
        <Trans message="Visitor has not started any chats recently" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.chats.map(chat => {
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
            onClick={() => onChatSelected(chat)}
          >
            <div className="mb-6 flex items-end justify-between gap-8">
              <div className="text-xs font-medium">
                <Trans message="Started :time" values={{time: startedAt}} />
              </div>
              <Chip color={getStatusColor(chat.status)} size="xs">
                {chat.status}
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

function getStatusColor(status: Chat['status']): ChipProps['color'] {
  switch (status) {
    case 'active':
    case 'idle':
      return 'positive';
    case 'closed':
      return 'chip';
    case 'queued':
    case 'unassigned':
      return 'primary';
  }
}
