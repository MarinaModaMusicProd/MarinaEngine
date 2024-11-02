import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {
  Chat,
  ChatSummary,
  ChatVisit,
  ChatVisitor,
  PreChatFormData,
} from '@livechat/widget/chat/chat';
import {BackendResponse} from '@common/http/backend-response/backend-response';

export interface UseDashboardChatResponse extends BackendResponse {
  chat: Chat;
  visitor: ChatVisitor;
  visits: ChatVisit[];
  summary: ChatSummary | null;
  preChatFormData?: PreChatFormData['body'];
}

interface Props {
  chatId: number | string | null;
  initialData?: UseDashboardChatResponse;
  disabled?: boolean;
}

export function useDashboardChat({chatId, disabled}: Props) {
  return useQuery({
    queryKey: ['chats', `${chatId}`],
    queryFn: () => fetchChat(chatId!),
    enabled: !disabled,
  });
}

function fetchChat(chatId: number | string) {
  return apiClient
    .get<UseDashboardChatResponse>(`lc/dashboard/chats/${chatId}`)
    .then(response => response.data);
}
