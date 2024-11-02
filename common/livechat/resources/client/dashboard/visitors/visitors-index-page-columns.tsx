import {ColumnConfig} from '@common/datatable/column-config';
import {Chat, ChatVisitor} from '@livechat/widget/chat/chat';
import {Trans} from '@ui/i18n/trans';
import {NameWithAvatarPlaceholder} from '@common/datatable/column-templates/name-with-avatar';
import {VisitorAvatar} from '@livechat/widget/chat/avatars/visitor-avatar';
import {ChatVisitorName} from '@livechat/dashboard/chats-page/chat-visitor-name';
import {
  useIsVisitorOnline,
  useOnlineVisitorIds,
} from '@livechat/dashboard/visitors/use-online-visitor-ids';
import {FormattedDuration} from '@ui/i18n/formatted-duration';
import {AgentAvatar} from '@livechat/widget/chat/avatars/agent-avatar';
import React, {ReactNode} from 'react';
import {OnlineStatusCircle} from '@ui/badge/online-status-circle';
import {Button} from '@ui/buttons/button';
import {PickFromQueueButton} from '@livechat/dashboard/chats-page/chat-feed/pick-from-queue-button';
import {Link} from 'react-router-dom';
import {useAuth} from '@common/auth/use-auth';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useCreateChat} from '@livechat/widget/chat/use-create-chat';
import {createPlaceholderChatMessage} from '@livechat/widget/chat/use-submit-chat-message';
import {useTrans} from '@ui/i18n/use-trans';
import {useSettings} from '@ui/settings/use-settings';
import {Skeleton} from '@ui/skeleton/skeleton';

export interface VisitorIndexPageModel extends ChatVisitor {
  chat_status: Chat['status'] | null;
  chat_assigned_to: Chat['assigned_to'];
  assignee?: Chat['assignee'];
  group?: Chat['group'];
  time_on_all_pages?: number;
  visits_count: number;
  chat_id: number | null;
  active_chat_created_at: string | null;
}

export const visitorsIndexPageColumns: ColumnConfig<VisitorIndexPageModel>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    sortingKey: 'user_identifier',
    header: () => <Trans message="Name" />,
    body: (visitor, row) =>
      row.isPlaceholder ? (
        <NameWithAvatarPlaceholder avatarCircle />
      ) : (
        <div className="flex items-center gap-12">
          <VisitorAvatar visitor={visitor} />
          <ChatVisitorName visitor={visitor} showIp />
        </div>
      ),
  },
  {
    key: 'email',
    allowsSorting: true,
    header: () => <Trans message="Email" />,
    body: (visitor, row) =>
      row.isPlaceholder ? (
        <Skeleton className="max-w-4/5" />
      ) : (
        <div>{visitor.email ?? visitor.user?.email ?? '-'}</div>
      ),
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    body: (visitor, row) => (
      <ActionsColumn visitor={visitor} isPlaceholder={row.isPlaceholder} />
    ),
  },
  {
    key: 'status',
    allowsSorting: true,
    header: () => <Trans message="Status" />,
    body: (visitor, row) => (
      <VisitorStatusColumn
        visitor={visitor}
        isPlaceholder={row.isPlaceholder}
      />
    ),
  },
  {
    key: 'chattingWith',
    allowsSorting: true,
    sortingKey: 'assigned_to',
    header: () => <Trans message="Chatting with" />,
    body: (visitor, row) => (
      <ChattingWithColumn visitor={visitor} isPlaceholder={row.isPlaceholder} />
    ),
  },
  {
    key: 'timeOnAllPages',
    allowsSorting: true,
    sortingKey: 'time_on_all_pages',
    header: () => <Trans message="Time on all pages" />,
    body: (visitor, row) => (
      <TimeOnAllPagesColumn
        visitor={visitor}
        isPlaceholder={row.isPlaceholder}
      />
    ),
  },
];

interface ColumnProps {
  visitor: VisitorIndexPageModel;
  isPlaceholder: boolean | undefined;
}
function TimeOnAllPagesColumn({visitor, isPlaceholder}: ColumnProps) {
  const onlineVisitors = useOnlineVisitorIds();

  if (isPlaceholder) {
    return <Skeleton className="max-w-120" />;
  }

  return (
    <FormattedDuration
      ms={visitor.time_on_all_pages}
      isLive={onlineVisitors.includes(visitor.id)}
      // 12 min
      maxIsLiveMs={720000}
      verbose
    />
  );
}

function ActionsColumn({visitor, isPlaceholder}: ColumnProps) {
  const isVisitorOnline = useIsVisitorOnline(visitor.id);

  if (isPlaceholder) {
    return <Skeleton className="min-h-30 max-w-90" variant="rect" />;
  }

  if (!isVisitorOnline) {
    return '-';
  }

  if (visitor.chat_id) {
    switch (visitor.chat_status) {
      case 'queued':
        return <PickFromQueueButton chatId={visitor.chat_id} size="xs" />;
      case 'unassigned':
        return (
          <PickFromQueueButton chatId={visitor.chat_id} size="xs">
            <Trans message="Assign to me" />
          </PickFromQueueButton>
        );
      case 'active':
      case 'idle':
        return (
          <Button
            variant="outline"
            size="xs"
            elementType={Link}
            to={`/agent/chats/${visitor.chat_id}`}
          >
            <Trans message="View chat" />
          </Button>
        );
    }
  }

  return <StartChatButton visitor={visitor} />;
}

interface StartChatButtonProps {
  visitor: VisitorIndexPageModel;
}
function StartChatButton({visitor}: StartChatButtonProps) {
  const createChat = useCreateChat();
  const {user} = useAuth();
  const navigate = useNavigate();
  const {trans} = useTrans();
  const {chatWidget} = useSettings();
  return (
    <Button
      variant="outline"
      size="xs"
      disabled={createChat.isPending}
      onClick={() => {
        createChat.mutate(
          {
            agentId: user!.id,
            visitorId: visitor.id,
            messages: [
              createPlaceholderChatMessage({
                body: trans({message: chatWidget?.defaultMessage ?? ''}),
                author: 'agent',
              }),
            ],
          },
          {onSuccess: r => navigate(`/agent/chats/${r.chat.id}`)},
        );
      }}
    >
      <Trans message="Start chat" />
    </Button>
  );
}

export function VisitorStatusColumn({visitor, isPlaceholder}: ColumnProps) {
  const isVisitorOnline = useIsVisitorOnline(visitor.id);

  if (isPlaceholder) {
    return (
      <div className="flex items-center gap-6">
        <Skeleton size="w-12 h-12" variant="rect" radius="rounded-full" />
        <Skeleton className="max-w-80" />
      </div>
    );
  }

  if (!isVisitorOnline) {
    return (
      <StatusMessage color="bg-chip">
        <Trans message="Left website" />
      </StatusMessage>
    );
  }

  switch (visitor.chat_status) {
    case 'queued':
      return (
        <StatusMessage color="bg-warning">
          {visitor.active_chat_created_at ? (
            <Trans
              message="Queued (:time)"
              values={{
                time: (
                  <FormattedDuration
                    startDate={visitor.active_chat_created_at}
                    isLive
                    verbose
                    minDuration={1000}
                  />
                ),
              }}
            />
          ) : (
            <Trans message="Queueud" />
          )}
        </StatusMessage>
      );
    case 'active':
    case 'idle':
      return (
        <StatusMessage color="bg-positive">
          <Trans message="Chatting" />
        </StatusMessage>
      );
    case 'unassigned':
      return (
        <StatusMessage color="bg-danger">
          <Trans message="Waiting for reply" />
        </StatusMessage>
      );
  }

  return (
    <StatusMessage color="bg-positive">
      <Trans message="Browsing" />
    </StatusMessage>
  );
}

function ChattingWithColumn({visitor, isPlaceholder}: ColumnProps) {
  const isChatActive =
    visitor.chat_status === 'active' || visitor.chat_status === 'idle';

  if (isPlaceholder) {
    return (
      <div className="flex items-center gap-6">
        <Skeleton size="w-24 h-24" variant="rect" radius="rounded-full" />
        <Skeleton className="max-w-80" />
      </div>
    );
  }

  if (!visitor?.assignee || !isChatActive) {
    return '-';
  }

  return (
    <div className="flex items-center gap-6">
      <AgentAvatar user={visitor.assignee} size="sm" />
      <div>{visitor.assignee.name}</div>
    </div>
  );
}

interface StatusMessageProps {
  color: string;
  children: ReactNode;
}
const StatusMessage = ({color, children}: StatusMessageProps) => (
  <div className="flex items-center gap-6">
    <OnlineStatusCircle color={color} />
    {children}
  </div>
);
