import {ChatContentItem} from '@livechat/widget/chat/chat';
import {useEffect, useRef} from 'react';
import {echoStore} from '@livechat/widget/chat/broadcasting/echo-store';
import {chatVisitorChannel} from '@livechat/websockets/chat-visitor-channel';

interface Props {
  chat: {id: number; visitor_id: number};
  onMessageCreated: (message: ChatContentItem) => void;
}
export function useNewMessageEvent({chat, onMessageCreated}: Props) {
  const callbackRef = useRef(onMessageCreated);
  callbackRef.current = onMessageCreated;
  useEffect(() => {
    return echoStore().listen({
      channel: chatVisitorChannel.name(chat.visitor_id),
      type: 'public',
      events: [chatVisitorChannel.events.messages.created],
      callback: e => {
        if (e.chatId === chat.id) {
          callbackRef.current(e.message);
        }
      },
    });
  }, [chat.visitor_id, chat.id]);
}
