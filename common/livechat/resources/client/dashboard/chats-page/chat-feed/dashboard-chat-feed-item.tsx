import {
  ChatContentItem,
  ChatEvent,
  ChatMessage,
  ChatVisitor,
  PlaceholderChatMessage,
  PreChatFormData,
} from '@livechat/widget/chat/chat';
import {ChatFeedMessage} from '@livechat/widget/chat/feed/chat-feed-message';
import {openDialog} from '@ui/overlays/store/dialog-store';
import {FilePreviewDialog} from '@common/uploads/components/file-preview/file-preview-dialog';
import {Trans} from '@ui/i18n/trans';
import {useSettings} from '@ui/settings/use-settings';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {AgentAvatar} from '@livechat/widget/chat/avatars/agent-avatar';
import {VisitorAvatar} from '@livechat/widget/chat/avatars/visitor-avatar';
import {ChatFeedDateSeparator} from '@livechat/dashboard/chats-page/chat-feed/chat-feed-date-separator';
import {useTrans} from '@ui/i18n/use-trans';
import {ChatFeedFormData} from '@livechat/widget/chat/feed/chat-feed-form-data';

interface Props {
  message: ChatContentItem;
  allMessages: ChatContentItem[];
  index: number;
  visitor: ChatVisitor;
}
export function DashboardChatFeedItem({
  message,
  allMessages,
  index,
  visitor,
}: Props) {
  if (message.type === 'event') {
    if (message.body.name === 'visitor.startedChat') {
      return (
        <ChatFeedDateSeparator date={message.created_at} className="my-30" />
      );
    }
    return (
      <div>
        <div className="my-24 mr-40 flex justify-end gap-3 text-[11px] text-muted">
          <EventText event={message} /> -
          <time>
            <FormattedDate date={message.created_at} preset="time" />
          </time>
        </div>
      </div>
    );
  } else if (message.type === 'preChatFormData') {
    return (
      <ChatFeedFormData
        message={message}
        avatar={<ChatMessageAvatar message={message} visitor={visitor} />}
      />
    );
  } else {
    return (
      <ChatFeedMessage
        key={message.id}
        message={message}
        alignRight={message.author !== 'visitor'}
        avatar={<ChatMessageAvatar message={message} visitor={visitor} />}
        avatarVisible={message.author !== allMessages.at(index - 1)?.author}
        color={message.author === 'visitor' ? 'chip' : 'primary'}
        onAttachmentSelected={file => {
          openDialog(FilePreviewDialog, {entries: [file]});
        }}
      />
    );
  }
}

interface ChatMessageAvatarProps {
  message: ChatMessage | PlaceholderChatMessage | PreChatFormData;
  visitor: ChatVisitor;
}
function ChatMessageAvatar({message, visitor}: ChatMessageAvatarProps) {
  if (message.author === 'visitor') {
    return <VisitorAvatar visitor={visitor} user={message.user} />;
  }
  return message.user ? <AgentAvatar user={message.user} /> : null;
}

interface EventTextProps {
  event: ChatEvent;
}
function EventText({event}: EventTextProps) {
  const {trans} = useTrans();
  const {lc} = useSettings();
  const idleMin = lc?.timeout?.inactive ?? 10;
  const closedMin = lc?.timeout?.archive ?? 15;
  switch (event.body.name) {
    case 'closed.inactivity':
      return (
        <Trans
          message="archived - :minutes min inactivity"
          values={{minutes: closedMin}}
        />
      );
    case 'closed.byAgent':
      return (
        <Trans
          message="archived - closed by :agent"
          values={{agent: event.body.closedBy}}
        />
      );
    case 'visitor.idle':
      return (
        <Trans
          message="Idle - :minutes min inactivity"
          values={{minutes: idleMin}}
        />
      );
    case 'visitor.leftChat':
      return (
        <Trans
          message=":status - visitor left the chat"
          values={{status: trans({message: event.body.status ?? 'archived'})}}
        />
      );
    case 'agent.leftChat':
      if (event.body.status && event.body.oldAgent) {
        return (
          <Trans
            message=":status - :agent left the chat"
            values={{
              status: trans({message: event.body.status}),
              agent: event.body.oldAgent,
            }}
          />
        );
      }
      if (event.body.oldAgent && event.body.newAgent) {
        return (
          <Trans
            message="Chat assigned to :newAgent because :oldAgent left the chat"
            values={{
              newAgent: event.body.newAgent,
              oldAgent: event.body.oldAgent,
            }}
          />
        );
      }
      return <Trans message="Agent left the chat" />;
    case 'agent.changed':
      if (event.body.newAgent) {
        return (
          <Trans
            message="Reassigned to :agent"
            values={{
              agent: event.body.newAgent,
            }}
          />
        );
      } else {
        return <Trans message="Chat reassigned" />;
      }
    case 'group.changed':
      if (event.body.newGroup) {
        return (
          <Trans
            message="Transfered to :name group"
            values={{
              name: event.body.newGroup,
            }}
          />
        );
      } else {
        return <Trans message="Group changed" />;
      }
  }
}
