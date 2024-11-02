import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {NormalizedModel} from '@ui/types/normalized-model';
import {FileEntry} from '@common/uploads/file-entry';

interface Response {
  reply: CannedReply;
}

export interface CreateCannedReplyPayload {
  name: string;
  body: string | null;
  attachments?: Omit<FileEntry, 'parent' | 'children'>[];
  shared?: boolean;
  groupId?: number;
  tags?: NormalizedModel[];
}

export function useCreateCannedReply(
  form: UseFormReturn<CreateCannedReplyPayload>,
) {
  return useMutation({
    mutationFn: (payload: CreateCannedReplyPayload) =>
      createCannedReply(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['helpdesk', 'canned-replies'],
      });
      toast(message('Saved reply created'));
    },
    onError: err => onFormQueryError(err, form),
  });
}

function createCannedReply(payload: CreateCannedReplyPayload) {
  return apiClient
    .post<Response>(
      `helpdesk/canned-replies`,
      prepareCannedReplyPayload(payload),
    )
    .then(r => r.data);
}

export function prepareCannedReplyPayload(payload: CreateCannedReplyPayload) {
  return {
    ...payload,
    tags: payload.tags?.map(tag => tag.name),
    attachments: payload.attachments?.map(attachment => attachment.id),
  };
}
