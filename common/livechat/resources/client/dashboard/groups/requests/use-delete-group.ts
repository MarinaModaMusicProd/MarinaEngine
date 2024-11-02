import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

export function useDeleteGroup() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: {groupId: number}) => deleteGroup(payload.groupId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      toast(trans(message('Deleted group')));
    },
    onError: r => showHttpErrorToast(r),
  });
}

function deleteGroup(groupId: string | number) {
  return apiClient
    .delete<Response>(`helpdesk/groups/${groupId}`)
    .then(r => r.data);
}
