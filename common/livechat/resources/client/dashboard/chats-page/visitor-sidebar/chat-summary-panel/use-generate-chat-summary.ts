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

export function useGenerateChatSummary() {
  return useMutation({
    mutationFn: (payload: Payload) => generateSummary(payload),
    onError: err => showHttpErrorToast(err),
  });
}

function generateSummary({chatId}: Payload): Promise<Response> {
  return apiClient
    .post(`lc/chats/${chatId}/summary/generate`)
    .then(r => r.data);
}
