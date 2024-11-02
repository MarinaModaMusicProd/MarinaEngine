import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {User} from '@ui/types/user';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {message} from '@ui/i18n/message';
import {useNavigate} from '@common/ui/navigation/use-navigate';

interface Response extends BackendResponse {
  user: User;
}

export interface UpdateUserPayload
  extends Omit<Partial<User>, 'email_verified_at'> {
  email_verified_at?: boolean;
}

export function useUpdateUser(
  userId: number,
  form: UseFormReturn<UpdateUserPayload>,
) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),
    onSuccess: (response, props) => {
      toast(message('User updated'));
      queryClient.invalidateQueries({queryKey: ['users']});
      navigate('/admin/users');
    },
    onError: r => onFormQueryError(r, form),
  });
}

function updateUser(
  userId: number,
  payload: UpdateUserPayload,
): Promise<Response> {
  if (payload.roles) {
    payload.roles = payload.roles.map(r => r.id) as any;
  }
  return apiClient.put(`users/${userId}`, payload).then(r => r.data);
}
