import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {BaseAgentsQueryKey} from '@livechat/dashboard/agents/base-agents-query-key';

export function useRevokeAgentInvite() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: {inviteId: number}) => revokeInvite(payload.inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...BaseAgentsQueryKey, 'invites'],
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
