import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {Group, GroupUser} from '@helpdesk/groups/group';
import {useNavigate} from '@common/ui/navigation/use-navigate';

interface Response extends BackendResponse {
  group: Group;
}

export interface CreateGroupPayload {
  name: string;
  users: GroupUser[];
  chat_assignment_mode: Group['chat_assignment_mode'];
}

export function useCreateGroup(form: UseFormReturn<CreateGroupPayload>) {
  const navigate = useNavigate();
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => createRole(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      toast(trans(message('Created new group')));
      navigate('..', {relative: 'path'});
    },
    onError: r => onFormQueryError(r, form),
  });
}

function createRole(payload: CreateGroupPayload) {
  return apiClient.post<Response>('helpdesk/groups', payload).then(r => r.data);
}
