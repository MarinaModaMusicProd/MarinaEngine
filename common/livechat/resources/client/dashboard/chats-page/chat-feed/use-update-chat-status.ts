import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {useNavigate} from '@common/ui/navigation/use-navigate';

interface Payload {
  status: 'active' | 'closed';
}

export function useUpdateChatStatus(chatId: string | number) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: Payload) => changeStatus(chatId, payload),
    onSuccess: async (r, payload) => {
      if (payload.status === 'closed') {
        navigate(`/agent/archive/${chatId}`);
      } else {
        navigate(`/agent/chats/${chatId}`);
      }
      return await queryClient.invalidateQueries({
        queryKey: ['chats'],
      });
    },
    onError: err => showHttpErrorToast(err),
  });
}

function changeStatus(
  chatId: number | string,
  payload: Payload,
): Promise<Response> {
  return apiClient
    .put(`lc/chats/${chatId}/update-status`, payload)
    .then(r => r.data);
}
