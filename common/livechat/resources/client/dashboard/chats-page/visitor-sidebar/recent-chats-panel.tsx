import {Chat} from '@livechat/widget/chat/chat';
import {useRecentChats} from '@livechat/dashboard/chats-page/visitor-sidebar/use-recent-chats';
import {ProgressCircle} from '@ui/progress/progress-circle';
import React from 'react';
import {Trans} from '@ui/i18n/trans';
import {ChipProps} from '@ui/forms/input-field/chip-field/chip';
import {DashboardConversationList} from '@livechat/dashboard/chats-page/dashboard-conversation-list';

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
    <DashboardConversationList
      conversations={data.chats}
      onSelected={onChatSelected}
    />
  );
}

export function getChatStatusColor(status: Chat['status']): ChipProps['color'] {
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
