import {InfiniteData, useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {
  ChatContentItem,
  ChatMessage,
  PlaceholderChatMessage,
} from '@livechat/widget/chat/chat';
import {getCurrentDateTime} from '@ui/i18n/use-current-date-time';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';
import {FileEntry} from '@common/uploads/file-entry';
import {nanoid} from 'nanoid';

interface Response extends BackendResponse {
  //
}

export interface SubmitChatMessagePayload {
  body: string;
  chatId: number | string;
  author: ChatContentItem['author'];
  type: ChatMessage['type'];
  files?: FileEntry[];
}

export function useSubmitChatMessage(queryKey: unknown[]) {
  return useMutation({
    mutationFn: (payload: SubmitChatMessagePayload) => submitMessage(payload),
    onMutate: async payload => {
      await queryClient.cancelQueries({queryKey});

      const previousData = queryClient.getQueryData(queryKey);

      const newMessage = createPlaceholderChatMessage(payload);
      addMessageToChat(queryKey, newMessage);

      return {previousData};
    },
    onError: (err, payload, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      showHttpErrorToast(err);
    },
    onSettled: (response, error, payload) => {
      queryClient.invalidateQueries({queryKey});
    },
  });
}

export function addMessageToChat(
  queryKey: unknown[],
  newMessage: ChatContentItem,
) {
  queryClient.setQueryData<
    InfiniteData<PaginatedBackendResponse<ChatContentItem>>
  >(queryKey, old => {
    if (!old) return old;

    const oldPages = old.pages;

    const newPages = [...oldPages];
    newPages[0] = {
      ...oldPages[0],
      pagination: {
        ...oldPages[0].pagination,
        data: [...oldPages[0].pagination.data, newMessage],
      },
    };

    return {
      ...old,
      pages: newPages,
    };
  });
}

export function createPlaceholderChatMessage(data: {
  body: string;
  chatId?: number;
  type?: 'message' | 'note';
  files?: FileEntry[];
  author?: ChatContentItem['author'];
}): PlaceholderChatMessage {
  return {
    body: data.body,
    conversation_id: data.chatId ?? 0,
    id: nanoid(),
    type: data.type ?? 'message',
    created_at: getCurrentDateTime().toAbsoluteString(),
    attachments: data.files ?? [],
    author: data.author ?? 'visitor',
  };
}

function submitMessage({
  chatId,
  files,
  ...payload
}: SubmitChatMessagePayload): Promise<Response> {
  return apiClient
    .post(`lc/messages/${chatId}`, {
      ...payload,
      fileEntryIds: files?.map(f => f.id),
    })
    .then(r => r.data);
}
