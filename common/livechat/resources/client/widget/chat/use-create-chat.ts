import {apiClient} from '@common/http/query-client';
import {UseWidgetChatResponse} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';
import {PlaceholderChatMessage} from '@livechat/widget/chat/chat';
import {useMutation} from '@tanstack/react-query';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface CreateChatPayload {
  messages: PlaceholderChatMessage[];
  agentId?: number;
}

export function useCreateChat() {
  return useMutation({
    mutationFn: (payload: CreateChatPayload) => createChat(payload),
    onError: err => showHttpErrorToast(err),
  });
}

function createChat({messages, ...other}: CreateChatPayload) {
  const content = messages.map(message => ({
    body: message.body,
    fileEntryIds: message.attachments?.map(f => f.id),
    author: message.author,
  }));
  return apiClient
    .post<UseWidgetChatResponse>(`lc/chats`, {
      content,
      ...other,
    })
    .then(r => r.data);
}
