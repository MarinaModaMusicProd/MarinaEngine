import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

export function useRevokeAgentInvite() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: {inviteId: number}) => revokeInvite(payload.inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('helpdesk/agents/invites'),
      });
      toast(trans(message('Invite revoked')));
    },
    onError: r => showHttpErrorToast(r),
  });
}

function revokeInvite(inviteId: string | number) {
  return apiClient
    .delete<Response>(`helpdesk/agents/invite/${inviteId}`)
    .then(r => r.data);
}
