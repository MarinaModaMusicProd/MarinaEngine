import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useUnbanVisitor(
  visitorId: number | string,
  chatId?: number | string,
) {
  return useMutation({
    mutationFn: () => unbanUser(visitorId),
    onSuccess: () => {
      toast(message('Visitor unsuspended'));
      const promises = [
        queryClient.invalidateQueries({queryKey: ['visitors']}),
      ];
      if (chatId) {
        queryClient.invalidateQueries({queryKey: ['chats', `${chatId}`]});
      }
      return Promise.all(promises);
    },
    onError: r => showHttpErrorToast(r),
  });
}

function unbanUser(visitorId: number | string): Promise<Response> {
  return apiClient.delete(`lc/visitors/${visitorId}/unban`).then(r => r.data);
}
