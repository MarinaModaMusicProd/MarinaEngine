import {useUnseenChatsStore} from '@livechat/dashboard/unseen-chats/unseen-chats-store';
import React from 'react';
import clsx from 'clsx';

interface Props {
  chatId: number;
  className?: string;
}
export function UnseenMessagesBadge({chatId, className}: Props) {
  const hasUnseenMessages = useUnseenChatsStore(s =>
    s.chats.some(c => c.id === chatId && c.hasUnseenMessages),
  );
  return hasUnseenMessages ? (
    <div
      className={clsx(
        'h-12 w-12 flex-shrink-0 rounded-full bg-danger',
        className,
      )}
    />
  ) : null;
}
