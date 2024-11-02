import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {Group} from '@helpdesk/groups/group';
import {CreateGroupPayload} from '@livechat/dashboard/groups/requests/use-create-group';
import {useParams} from 'react-router-dom';
import {useNavigate} from '@common/ui/navigation/use-navigate';

interface Response extends BackendResponse {
  group: Group;
}

export interface UpdateGroupPayload extends Partial<CreateGroupPayload> {}

export function useUpdateGroup(
  form: UseFormReturn<Partial<UpdateGroupPayload>>,
) {
  const navigate = useNavigate();
  const {groupId} = useParams();
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: UpdateGroupPayload) => updateGroup(groupId!, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      toast(trans(message('Updated group')));
      navigate('../../', {relative: 'path'});
    },
    onError: r => onFormQueryError(r, form),
  });
}

function updateGroup(groupId: string, payload: UpdateGroupPayload) {
  return apiClient
    .put<Response>(`helpdesk/groups/${groupId}`, payload)
    .then(r => r.data);
}
