import {useParams} from 'react-router-dom';
import {useDashboardChatMessages} from '@livechat/dashboard/chats-page/chat-feed/use-dashboard-chat-messages';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';

export function useActiveDashboardChat() {
  const {chatId} = useParams();
  const activeChatQuery = useDashboardChat({
    chatId: chatId ?? null,
    disabled: !chatId,
  });

  // prefetch messages for active chat
  useDashboardChatMessages({
    chatId: chatId!,
    prefetchOnly: true,
    disabled: !chatId,
  });

  return activeChatQuery;
}
