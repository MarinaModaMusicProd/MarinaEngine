import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {BaseAgentsQueryKey} from '@livechat/dashboard/agents/base-agents-query-key';

interface Payload {
  inviteId: number;
}

export function useResendAgentInvite() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: Payload) => resendInvite(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...BaseAgentsQueryKey, 'invites'],
      });
      toast(trans(message('Invite resent')));
    },
    onError: r => showHttpErrorToast(r),
  });
}

function resendInvite(payload: Payload) {
  return apiClient
    .post(`helpdesk/agents/invite/${payload.inviteId}/resend`, payload)
    .then(r => r.data);
}
