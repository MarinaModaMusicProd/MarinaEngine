import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';
import {ChatContentItem} from '@livechat/widget/chat/chat';
import {SimplePaginationResponse} from '@common/http/backend-response/pagination-response';
import {
  useWidgetChat,
  widgetChatQueryKey,
} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';
import {useRequiredParams} from '@common/ui/navigation/use-required-params';

export function widgetChatMessagesQueryKey(chatId: number | string) {
  const key = widgetChatQueryKey(chatId);
  return [...key, 'messages'];
}

export function useWidgetChatMessages() {
  const {chatId} = useRequiredParams(['chatId']);
  const chatQuery = useWidgetChat();
  return useInfiniteData<
    ChatContentItem,
    {},
    {pagination: SimplePaginationResponse<ChatContentItem>}
  >({
    endpoint: 'lc/messages/widget',
    queryKey: widgetChatMessagesQueryKey(chatId),
    preserveQueryKey: true,
    queryParams: {chatId},
    initialPage: chatQuery.data?.messages,
    reverse: true,
  });
}
