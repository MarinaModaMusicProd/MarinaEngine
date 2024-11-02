import {
  ChatMessage,
  ChatMessageAttachment,
  PlaceholderChatMessage,
} from '@livechat/widget/chat/chat';
import clsx from 'clsx';
import {AvatarProps} from '@ui/avatar/avatar';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {ChatFeedBubble} from '@livechat/widget/chat/feed/chat-feed-bubble';
import {ChatFeedAttachments} from '@livechat/widget/chat/feed/chat-feed-attachments';
import {Trans} from '@ui/i18n/trans';
import {VisibilityOffIcon} from '@ui/icons/material/VisibilityOff';
import {Fragment, ReactElement, ReactNode} from 'react';

interface ChatFeedMessageProps {
  message: ChatMessage | PlaceholderChatMessage;
  alignRight: boolean;
  avatar?: ReactElement<AvatarProps>;
  avatarVisible?: boolean;
  color: 'primary' | 'chip';
  onAttachmentSelected?: (file: ChatMessageAttachment) => void;
}
export function ChatFeedMessage({
  message,
  alignRight,
  avatarVisible,
  avatar,
  color,
  onAttachmentSelected,
}: ChatFeedMessageProps) {
  return (
    <ChatFeedMessageLayout
      alignRight={alignRight}
      avatar={avatar}
      avatarVisible={avatarVisible}
      description={
        <Fragment>
          <time>
            <FormattedDate date={message.created_at} preset="time" />
          </time>
          {message.type === 'note' && <NoteIndicator />}
        </Fragment>
      }
    >
      {message.body ? (
        <ChatFeedBubble
          alignRight={alignRight}
          color={message.type === 'note' ? 'note' : color}
          allowBreak
          attachmentCount={message.attachments?.length}
        >
          {message.body}
        </ChatFeedBubble>
      ) : null}
      {message.attachments?.length ? (
        <ChatFeedAttachments
          onSelected={onAttachmentSelected}
          attachments={message.attachments}
          alignRight={alignRight}
          color={color}
        />
      ) : null}
    </ChatFeedMessageLayout>
  );
}

interface ChatFeedMessageLayoutProps {
  alignRight: boolean;
  avatar?: ReactElement<AvatarProps>;
  avatarVisible?: boolean;
  children: ReactNode;
  description?: ReactNode;
}
export function ChatFeedMessageLayout({
  alignRight,
  avatarVisible,
  avatar,
  children,
  description,
}: ChatFeedMessageLayoutProps) {
  return (
    <div
      className={clsx(
        'flex items-start gap-8',
        alignRight && 'flex-row-reverse',
      )}
    >
      {avatar != null && (
        <div className="min-w-32">{avatarVisible && avatar}</div>
      )}
      <div className={clsx('w-max max-w-280')}>
        {children}
        <div
          className={clsx(
            'mt-4 block text-[11px] text-muted',
            alignRight && 'text-end',
          )}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

function NoteIndicator() {
  return (
    <div className="inline-flex items-center">
      <div className="mx-6">•</div>
      <VisibilityOffIcon size="2xs" />
      <div className="ml-4 text-xs text-muted">
        <Trans message="Internal note" />
      </div>
    </div>
  );
}
