import {ChatContentItem} from '@livechat/widget/chat/chat';
import {SimplePaginationResponse} from '@common/http/backend-response/pagination-response';
import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';

export function dashboardChatMessagesQueryKey(chatId: number | string) {
  return ['chats', `${chatId}`, 'messages'];
}
interface Props {
  disabled?: boolean;
  chatId: number | string;
  prefetchOnly?: boolean;
}

export function useDashboardChatMessages({
  chatId,
  disabled,
  prefetchOnly,
}: Props) {
  return useInfiniteData<
    ChatContentItem,
    {},
    {pagination: SimplePaginationResponse<ChatContentItem>}
  >({
    endpoint: 'lc/messages/dashboard',
    queryKey: dashboardChatMessagesQueryKey(chatId),
    preserveQueryKey: true,
    queryParams: {chatId},
    reverse: true,
    disabled,
    prefetchOnly,
  });
}
