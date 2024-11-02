import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Chat} from '@livechat/widget/chat/chat';

export type DashboardChatGroup = 'queued' | 'unassigned' | 'myChats' | 'other';

export interface UseDashboardChatsResponse {
  groupedChats: Record<DashboardChatGroup, Chat[]>;
  firstChatId: number | null;
}

export function useDashboardChats() {
  return useQuery({
    queryKey: ['chats', 'all'],
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
