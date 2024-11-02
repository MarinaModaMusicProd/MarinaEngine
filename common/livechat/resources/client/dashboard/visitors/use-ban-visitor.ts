import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {message} from '@ui/i18n/message';
import {CreateBanPayload} from '@common/admin/users/requests/use-ban-user';
import {ChatVisitor} from '@livechat/widget/chat/chat';

interface Response extends BackendResponse {
  visitor: ChatVisitor;
}

export function useBanVisitor(
  form: UseFormReturn<CreateBanPayload>,
  visitorId: number | string,
  chatId?: number | string,
) {
  return useMutation({
    mutationFn: (payload: CreateBanPayload) => banVisitor(visitorId, payload),
    onSuccess: () => {
      toast(message('Customer suspended'));
      const promises = [
        queryClient.invalidateQueries({queryKey: ['visitors']}),
      ];
      if (chatId) {
        queryClient.invalidateQueries({queryKey: ['chats', `${chatId}`]});
      }
      return Promise.all(promises);
    },
    onError: r => onFormQueryError(r, form),
  });
}

function banVisitor(
  visitorId: number | string,
  payload: CreateBanPayload,
): Promise<Response> {
  return apiClient
    .post(`lc/visitors/${visitorId}/ban`, payload)
    .then(r => r.data);
}
