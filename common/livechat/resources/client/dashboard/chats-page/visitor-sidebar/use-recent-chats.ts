import {Chat} from '@livechat/widget/chat/chat';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';

interface Response {
  chats: Chat[];
}

export function useRecentChats(
  visitorId: number | string,
  initialData?: Chat[],
) {
  return useQuery<Response>({
    queryKey: ['visitors', visitorId, 'chats'],
    queryFn: () => fetchVisits(visitorId),
    initialData: initialData ? () => ({chats: initialData}) : undefined,
  });
}

function fetchVisits(visitorId: number | string) {
  return apiClient
    .get<Response>(`lc/visitors/${visitorId}/recent-chats`)
    .then(response => response.data);
}
