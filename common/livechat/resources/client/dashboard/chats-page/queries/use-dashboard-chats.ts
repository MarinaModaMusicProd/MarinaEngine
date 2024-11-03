import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Chat} from '@livechat/widget/chat/chat';

export interface UseDashboardChatsResponse {
  groupedChats: {
    queued: Chat[];
    myChats: Chat[];
  };
  firstChatId: number | null;
}

export function useDashboardChats() {
  return useQuery({
    queryKey: ['dashboard', 'chats', 'active'],
    queryFn: () => {
      return fetchChats();
    },
  });
}

function fetchChats() {
  return apiClient
    .get<UseDashboardChatsResponse>('lc/dashboard/chats')
    .then(response => response.data);
}
