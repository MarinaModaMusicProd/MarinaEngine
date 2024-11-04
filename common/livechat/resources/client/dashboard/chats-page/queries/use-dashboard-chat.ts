import {useQuery} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {Chat, ChatVisit, ChatVisitor} from '@livechat/widget/chat/chat';
import {BackendResponse} from '@common/http/backend-response/backend-response';

export interface UseDashboardChatResponse extends BackendResponse {
  chat: Chat;
  visitor: ChatVisitor;
  visits: ChatVisit[];
}

interface Props {
  chatId: number | string | null;
  initialData?: UseDashboardChatResponse;
  disabled?: boolean;
}

export function useDashboardChat({chatId, disabled}: Props) {
  return useQuery({
    queryKey: ['dashboard', 'chats', chatId],
    queryFn: () => fetchChat(chatId!),
    enabled: !disabled,
  });
}

export function updateDashboardChat(
  chatId: number | string,
  data: Partial<Chat>,
) {
  queryClient.setQueryData<UseDashboardChatResponse>(
    ['dashboard', 'chats', `${chatId}`],
    old => {
      if (!old) {
        return old;
      }
      return {
        ...old,
        chat: {
          ...old.chat,
          ...data,
        },
      };
    },
  );
}

function fetchChat(chatId: number | string) {
  return apiClient
    .get<UseDashboardChatResponse>(`lc/dashboard/chats/${chatId}`)
    .then(response => response.data);
}
