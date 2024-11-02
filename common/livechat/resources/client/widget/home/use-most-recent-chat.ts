import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Chat, ChatContentItem, ChatVisitor} from '@livechat/widget/chat/chat';
import {getWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';
import {SimplePaginationResponse} from '@common/http/backend-response/pagination-response';
import {widgetChatQueryKey} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';

export interface UseMostRecentChatResponse {
  chat?: Chat;
  visitor: ChatVisitor;
  messages?: SimplePaginationResponse<ChatContentItem>;
}

export function useMostRecentChat() {
  return useQuery<UseMostRecentChatResponse>({
    queryKey: widgetChatQueryKey('most-recent'),
    queryFn: () => fetchMostRecentChat(),
    initialData: () => getWidgetBootstrapData().mostRecentChat,
  });
}

function fetchMostRecentChat() {
  return apiClient
    .get<UseMostRecentChatResponse>(`lc/chats/most-recent`)
    .then(response => response.data);
}
