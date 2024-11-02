import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Chat} from '@livechat/widget/chat/chat';

interface Response {
  conversations: Chat[];
}

export function useWidgetConversations() {
  return useQuery<Response>({
    queryKey: ['chats', 'conversations'],
    queryFn: () => fetchConversations(),
  });
}

function fetchConversations() {
  return apiClient.get<Response>(`lc/chats`).then(response => response.data);
}
