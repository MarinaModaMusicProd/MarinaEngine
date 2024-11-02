import {apiClient, queryClient} from '@common/http/query-client';
import {UseWidgetChatResponse} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';
import {PlaceholderChatMessage} from '@livechat/widget/chat/chat';
import {useMutation} from '@tanstack/react-query';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {getBootstrapData} from '@ui/bootstrap-data/bootstrap-data-store';

interface CreateChatPayload {
  messages?: PlaceholderChatMessage[];
  agentId?: number;
  visitorId?: number;
  preChatForm?: Record<string, unknown>;
}

export function useCreateChat() {
  return useMutation({
    mutationFn: (payload: CreateChatPayload) => createChat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['chats']});
    },
    onError: err => showHttpErrorToast(err),
  });
}

function createChat({messages, preChatForm, ...other}: CreateChatPayload) {
  const content = messages?.map(message => ({
    body: message.body,
    fileEntryIds: message.attachments?.map(f => f.id),
    author: message.author,
  }));
  return apiClient
    .post<UseWidgetChatResponse>(`lc/chats`, {
      content,
      preChatForm: preChatForm ? formatPreChatFormData(preChatForm) : null,
      ...other,
    })
    .then(r => r.data);
}

function formatPreChatFormData(data: Record<string, unknown>) {
  const config = getBootstrapData().settings.chatWidget?.forms?.preChat;
  if (!config) return null;

  const formattedData = [];

  for (const key in data) {
    const element = config.elements.find(e => e.id === key);
    if (!element || !('label' in element)) continue;

    formattedData.push({
      id: key,
      name: element.name,
      label: element.label,
      value: data[key],
    });
  }

  return formattedData;
}
