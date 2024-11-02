import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Payload {
  agentId: number;
  shouldSummarize?: boolean;
  privateNote?: string;
}

export function useAssignChatToAgent(chatId: string | number) {
  return useMutation({
    mutationFn: (payload: Payload) => assignChat(chatId, payload),
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['chats'],
      });
    },
    onError: err => showHttpErrorToast(err),
  });
}

function assignChat(
  chatId: number | string,
  payload: Payload,
): Promise<Response> {
  return apiClient
    .post(`lc/chats/assign/agent`, {
      chatIds: [chatId],
      userId: payload.agentId,
      shouldSummarize: payload.shouldSummarize,
      privateNote: payload.privateNote,
    })
    .then(r => r.data);
}
