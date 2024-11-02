import {PreChatFormData} from '@livechat/widget/chat/chat';
import {Trans} from '@ui/i18n/trans';
import {ChatFeedMessageLayout} from '@livechat/widget/chat/feed/chat-feed-message';
import {ReactElement} from 'react';
import {AvatarProps} from '@ui/avatar/avatar';
import {ChatFeedBubble} from '@livechat/widget/chat/feed/chat-feed-bubble';
import {FormattedDate} from '@ui/i18n/formatted-date';

interface Props {
  message: PreChatFormData;
  avatar: ReactElement<AvatarProps>;
}
export function ChatFeedFormData({message, avatar}: Props) {
  return (
    <ChatFeedMessageLayout
      alignRight={false}
      avatar={avatar}
      avatarVisible={true}
      description={
        <time>
          <FormattedDate date={message.created_at} preset="time" />
        </time>
      }
    >
      <ChatFeedBubble color="chip" alignRight={false}>
        <div className="mb-14 text-left font-semibold">
          <Trans message="Pre-chat form" />
        </div>
        <DataListProps message={message} />
      </ChatFeedBubble>
    </ChatFeedMessageLayout>
  );
}

interface DataListProps {
  message: PreChatFormData;
}

function DataListProps({message}: DataListProps) {
  return (
    <div className="space-y-14 text-left">
      {message.body.map(item => (
        <div key={item.id}>
          <div className="mb-6 text-muted">{item.label}</div>
          <div>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
