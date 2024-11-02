import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {
  CreateCannedReplyPayload,
  prepareCannedReplyPayload,
} from '@helpdesk/canned-replies/requests/use-create-canned-reply';

interface Response {
  reply: CannedReply;
}

export function useUpdateCannedReply(
  form: UseFormReturn<CreateCannedReplyPayload>,
  id: number,
) {
  return useMutation({
    mutationFn: (payload: CreateCannedReplyPayload) =>
      updateCannedReply(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['helpdesk', 'canned-replies'],
      });
      toast(message('Reply updated'));
    },
    onError: err => onFormQueryError(err, form),
  });
}

function updateCannedReply(id: number, payload: CreateCannedReplyPayload) {
  return apiClient
    .put<Response>(
      `helpdesk/canned-replies/${id}`,
      prepareCannedReplyPayload(payload),
    )
    .then(r => r.data);
}
