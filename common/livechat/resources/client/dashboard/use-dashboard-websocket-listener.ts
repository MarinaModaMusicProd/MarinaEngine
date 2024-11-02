import {useEffect, useRef} from 'react';
import {echoStore} from '@livechat/widget/chat/broadcasting/echo-store';
import {helpdeskChannel} from '@helpdesk/websockets/helpdesk-channel';
import {queryClient} from '@common/http/query-client';
import {useSoundManager} from '@livechat/widget/chat/broadcasting/use-sound-manager';
import {useDebouncedCallback} from 'use-debounce';
import type {ConversationEvent} from '@livechat/widget/use-widget-websocket-listener';
import {useAuth} from '@common/auth/use-auth';
import {useParams} from 'react-router-dom';
import {dashboardChatMessagesQueryKey} from '@livechat/dashboard/chats-page/chat-feed/use-dashboard-chat-messages';
import {unseenChatsStore} from '@livechat/dashboard/unseen-chats/unseen-chats-store';
import {pageVisitsQueryKey} from '@livechat/dashboard/chats-page/visitor-sidebar/use-page-visits';
import {BaseAgentsQueryKey} from '@livechat/dashboard/agents/base-agents-query-key';

export function useDashboardWebsocketListener() {
  const {user} = useAuth();
  const currentUserId = user?.id ?? null;
  const params = useParams();
  const chatId = params.chatId ? +params.chatId : null;
  const {playSound} = useSoundManager();

  // make sure there are no duplicate requests if multiple similar
  // events are fired in a short time by debouncing handlers
  const invalidateChatQueries = useDebouncedCallback(() => {
    queryClient.invalidateQueries({queryKey: ['chats']});
  }, 500);

  const handleAgentEvent = useDebouncedCallback(() => {
    queryClient.invalidateQueries({queryKey: BaseAgentsQueryKey});
  }, 500);

  const handleVisitorEvent = useDebouncedCallback(() => {
    queryClient.invalidateQueries({queryKey: ['visitors']});
    playSound('newVisitor');
  }, 500);

  const handleVisitEvent = useDebouncedCallback(e => {
    queryClient.invalidateQueries({queryKey: pageVisitsQueryKey(e.visitorId)});
  }, 500);

  // invalidate chat queries when any relevant event occurs
  useListener(
    [
      helpdeskChannel.events.conversations.created,
      helpdeskChannel.events.conversations.agentChanged,
      helpdeskChannel.events.conversations.groupChanged,
      helpdeskChannel.events.conversations.statusChanged,
    ],
    invalidateChatQueries,
  );

  // handle unseen chats/messages count
  useListener<ConversationEvent>(
    [
      helpdeskChannel.events.conversations.created,
      helpdeskChannel.events.conversations.agentChanged,
      helpdeskChannel.events.conversations.groupChanged,
      helpdeskChannel.events.conversations.statusChanged,
      helpdeskChannel.events.conversations.newMessage,
    ],
    e => {
      // clear chats from unseen if they were closed or assigned to another agent
      const chatsToClear = e.conversations
        .filter(c => c.status === 'closed' || c.assigned_to !== user?.id)
        .map(c => c.id);
      unseenChatsStore().clearChats(chatsToClear);

      // add chats to unseen if they are assigned to the current agent and are open
      const newChatIds = e.conversations
        .filter(c => c.assigned_to === user?.id && c.status !== 'closed')
        .map(c => c.id);
      const isChatsPage = document.location.pathname.startsWith('/agent/chats');

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

  // play sound when new chat is available for agent
  useListener<ConversationEvent>(
    [
      helpdeskChannel.events.conversations.created,
      helpdeskChannel.events.conversations.agentChanged,
      helpdeskChannel.events.conversations.statusChanged,
    ],
    e => {
      if (
        e.conversations.some(
          c => c.assigned_to === currentUserId && c.status !== 'closed',
        )
      ) {
        playSound('incomingChat');
        return;
      }

      if (e.conversations.some(c => c.status === 'queued')) {
        playSound('queuedVisitor');
        return;
      }
    },
  );

  // play sound when new message is added to chat
  useListener<ConversationEvent>(
    [helpdeskChannel.events.conversations.newMessage],
    async e => {
      if (e.conversations.every(c => c.assigned_to === currentUserId)) {
        await queryClient.invalidateQueries({
          queryKey: dashboardChatMessagesQueryKey(e.conversations[0].id),
        });
        // don't play new message sound if chat is currently active
        if (e.conversations[0].id !== chatId) {
          playSound('message');
        }
      }
    },
  );

  // invalidate agent queries when any relevant event occurs
  useListener([helpdeskChannel.events.agents.updated], handleAgentEvent);

  // invalidate visitor queries when any relevant event occurs
  useListener([helpdeskChannel.events.visitors.created], handleVisitorEvent);

  // invalidate visits queries when any relevant event occurs
  useListener([helpdeskChannel.events.visitors.visitCreated], handleVisitEvent);
}

function useListener<T>(events: string[], callback: (e: T) => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return echoStore().listen<ConversationEvent>({
      channel: helpdeskChannel.name,
      events,
      type: 'presence',
      callback: e => {
        callbackRef.current(e as T);
      },
    });
    // events are ignored on purpose, they will never change
  }, []);
}
