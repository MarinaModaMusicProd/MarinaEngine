import {useQuery} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {Chat, ChatContentItem} from '@livechat/widget/chat/chat';
import {SimplePaginationResponse} from '@common/http/backend-response/pagination-response';
import {getWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';
import {useParams} from 'react-router-dom';

export interface UseWidgetChatResponse {
  chat: Chat;
  messages: SimplePaginationResponse<ChatContentItem>;
  queuedChatInfo?: {
    positionInQueue: number;
    estimatedWaitTime: number;
  };
}

export function widgetChatQueryKey(chatId: number | string) {
  return ['chats', `${chatId}`];
}

export function setWidgetChatData(data: UseWidgetChatResponse) {
  queryClient.setQueryData<UseWidgetChatResponse>(
    widgetChatQueryKey(data.chat.id),
    data,
  );
}

export function useWidgetChat() {
  const {chatId} = useParams();
  return useQuery<UseWidgetChatResponse>({
    queryKey: widgetChatQueryKey(chatId!),
    queryFn: () => fetchChat(chatId!),
    enabled: chatId !== undefined,
    initialData: () => {
      const data = getWidgetBootstrapData().mostRecentChat;
      return data.chat && `${data.chat.id}` === chatId
        ? {chat: data.chat, messages: data.messages!}
        : undefined;
    },
  });
}

function fetchChat(chatId: number | string) {
  return apiClient
    .get<UseWidgetChatResponse>(`lc/chats/${chatId}`)
    .then(response => response.data);
}
