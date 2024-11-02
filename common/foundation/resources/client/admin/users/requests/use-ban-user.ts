import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {message} from '@ui/i18n/message';

interface Response extends BackendResponse {
  bannable: unknown;
}

export interface CreateBanPayload {
  ban_until?: string;
  permanent?: boolean;
  comment?: string;
}

export function useBanUser(
  form: UseFormReturn<CreateBanPayload>,
  userId: number | string,
) {
  return useMutation({
    mutationFn: (payload: CreateBanPayload) => banUser(userId, payload),
    onSuccess: async () => {
      toast(message('User suspended'));
      await queryClient.invalidateQueries({queryKey: ['users']});
    },
    onError: r => onFormQueryError(r, form),
  });
}

function banUser(
  userId: number | string,
  payload: CreateBanPayload,
): Promise<Response> {
  return apiClient.post(`users/ban/${userId}`, payload).then(r => r.data);
}
