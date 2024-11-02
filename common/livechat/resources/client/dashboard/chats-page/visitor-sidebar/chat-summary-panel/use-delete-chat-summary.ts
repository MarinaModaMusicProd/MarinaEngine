import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {ChatSummary} from '@livechat/widget/chat/chat';

interface Response extends BackendResponse {
  summary: ChatSummary;
}

interface Payload {
  chatId: number | string;
}

export function useDeleteChatSummary() {
  return useMutation({
    mutationFn: (payload: Payload) => deleteSummary(payload),
    onError: err => showHttpErrorToast(err),
  });
}

function deleteSummary({chatId}: Payload): Promise<Response> {
  return apiClient.delete(`lc/chats/${chatId}/summary`).then(r => r.data);
}
