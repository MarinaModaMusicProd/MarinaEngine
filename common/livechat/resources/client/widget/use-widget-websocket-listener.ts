import {useEffect, useRef} from 'react';
import {echoStore} from '@livechat/widget/chat/broadcasting/echo-store';
import {helpdeskChannel} from '@helpdesk/websockets/helpdesk-channel';
import {useWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';
import {queryClient} from '@common/http/query-client';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useDebouncedCallback} from 'use-debounce';
import {Chat} from '@livechat/widget/chat/chat';
import {useParams} from 'react-router-dom';
import {useSoundManager} from '@livechat/widget/chat/broadcasting/use-sound-manager';
import {widgetChatMessagesQueryKey} from '@livechat/widget/chat/active-chat-screen/use-widget-chat-messages';
import {unseenChatsStore} from '@livechat/dashboard/unseen-chats/unseen-chats-store';

export interface ConversationEvent {
  event: string;
  messageId?: number;
  conversations: {
    id: number;
    status: Chat['status'];
    assigned_to: number;
    user_id: number;
    visitor_id: number;
  }[];
}

export function useWidgetWebsocketListener() {
  const navigate = useNavigate();
  const {mostRecentChat} = useWidgetBootstrapData();
  const params = useParams();
  const chatId = params.chatId ? +params.chatId : null;
  const {playSound} = useSoundManager();

  // make sure there are no duplicate requests if multiple similar
  // events are fired in a short time by debouncing handlers
  const invalidateChatQueries = useDebouncedCallback(() => {
    queryClient.invalidateQueries({queryKey: ['chats']});
  }, 500);

  // invalidate chat queries when any relevant event occurs
  useListener(
    [
      helpdeskChannel.events.conversations.created,
      helpdeskChannel.events.conversations.agentChanged,
      helpdeskChannel.events.conversations.statusChanged,
    ],
    mostRecentChat.visitor.id,
    invalidateChatQueries,
  );

  // handle unseen chats/messages count
  useListener<ConversationEvent>(
    [
      helpdeskChannel.events.conversations.created,
      helpdeskChannel.events.conversations.agentChanged,
      helpdeskChannel.events.conversations.statusChanged,
      helpdeskChannel.events.conversations.newMessage,
    ],
    mostRecentChat.visitor.id,
    e => {
      // clear chats from unseen if they were closed
      const chatsToClear = e.conversations
        .filter(c => c.status === 'closed')
        .map(c => c.id);
      unseenChatsStore().clearChats(chatsToClear);

      // add chats to unseen if they are currently and open
      const newChatIds = e.conversations
        .filter(c => c.status !== 'closed')
        .map(c => c.id);
      const isChatsPage = document.location.pathname.startsWith('/chats');

      // 1. If we are not in chats page, show badge in menu, run interval and add dot to chat list sidebar items
      // 2. If we are in chats page, only add dot to chat list items and only if that chat is not currently open
      if (!isChatsPage) {
        unseenChatsStore().addChats(newChatIds, {
          hasUnseenMessages: true,
          unseen: true,
        });
      } else if (!newChatIds.some(id => id === chatId)) {
        unseenChatsStore().addChats(newChatIds, {
          unseen: false,
          hasUnseenMessages: true,
        });
      }
    },
  );

  // play sound when new chat is available for visitor
  useListener<ConversationEvent>(
    [
      helpdeskChannel.events.conversations.created,
      helpdeskChannel.events.conversations.statusChanged,
    ],
    mostRecentChat.visitor.id,
    e => {
      if (e.conversations[0].status !== 'closed') {
        playSound('incomingChat');
        // if not already on chat page, navigate to new chat
        if (!chatId) {
          navigate(`/chats/${e.conversations[0].id}`);
        }
      }
    },
  );

  // play sound when new message is added to chat
  useListener<ConversationEvent>(
    [helpdeskChannel.events.conversations.newMessage],
    mostRecentChat.visitor.id,
    async e => {
      await queryClient.invalidateQueries({
        queryKey: widgetChatMessagesQueryKey(e.conversations[0].id),
      });
      // don't play new message sound if chat is currently active
      if (e.conversations[0].id !== chatId) {
        playSound('message');
      }
    },
  );
}

function useListener<T>(
  events: string[],
  visitorId: number,
  callback: (e: T) => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return echoStore().listen<ConversationEvent>({
      channel: helpdeskChannel.name,
      events,
      type: 'presence',
      callback: e => {
        if (e.conversations.every(c => c.visitor_id === visitorId)) {
          callbackRef.current(e as T);
        }
      },
    });
    // events are ignored on purpose, they will never change
  }, [visitorId]);
}
