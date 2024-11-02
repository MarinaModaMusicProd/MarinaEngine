import {ChatSummary} from '@livechat/widget/chat/chat';
import {useQuery} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';

interface Response {
  summary: ChatSummary | null;
}

const queryKey = (conversationId: number | string) => [
  'dashboard',
  'chats',
  `${conversationId}`,
  'summary',
];

export function useConversationSummary(
  conversationId: number | string,
  initialData?: ChatSummary | null,
) {
  return useQuery<Response>({
    queryKey: queryKey(conversationId),
    queryFn: () => fetchSummary(conversationId),
    initialData: initialData ? () => ({summary: initialData}) : undefined,
  });
}

export function setConversationSummaryQueryData(
  conversationId: number | string,
  summary: ChatSummary | null,
) {
  queryClient.setQueryData<Response>(queryKey(conversationId), {
    summary: summary as any,
  });
}

function fetchSummary(conversationId: number | string) {
  return apiClient
    .get<Response>(`lc/chats/${conversationId}/summary`)
    .then(response => response.data);
}
