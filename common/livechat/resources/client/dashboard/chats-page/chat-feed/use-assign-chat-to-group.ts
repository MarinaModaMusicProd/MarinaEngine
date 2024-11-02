import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Payload {
  groupId: number;
  shouldSummarize?: boolean;
  privateNote?: string;
}

export function useAssignChatToGroup(chatId: string | number) {
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
    .post(`lc/chats/assign/group`, {
      chatIds: [chatId],
      ...payload,
    })
    .then(r => r.data);
}
