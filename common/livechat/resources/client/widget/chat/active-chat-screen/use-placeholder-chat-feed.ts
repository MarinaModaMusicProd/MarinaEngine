import {PlaceholderChatMessage} from '@livechat/widget/chat/chat';
import {useCallback, useState} from 'react';
import {createPlaceholderChatMessage} from '@livechat/widget/chat/use-submit-chat-message';
import {FileEntry} from '@common/uploads/file-entry';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useSettings} from '@ui/settings/use-settings';
import {useTrans} from '@ui/i18n/use-trans';
import {useCreateChat} from '@livechat/widget/chat/use-create-chat';

export function usePlaceholderChatFeed() {
  const {chatWidget} = useSettings();
  const navigate = useNavigate();
  const {trans} = useTrans();
  const createChat = useCreateChat();
  const [messages, setMessages] = useState<PlaceholderChatMessage[]>(() => {
    const message = createPlaceholderChatMessage({
      body: trans({message: chatWidget?.defaultMessage ?? ''}),
      author: 'agent',
    });
    return [message];
  });

  const handleSubmitMessage = useCallback(
    (data: {body: string; files: FileEntry[]}) => {
      const newMessages = [...messages, createPlaceholderChatMessage(data)];
      setMessages(newMessages);
      createChat.mutate(
        {messages: newMessages},
        {
          onSuccess: response => {
            navigate(`/chats/${response.chat.id}`, {replace: true});
          },
        },
      );
    },
    [createChat, messages, navigate],
  );

  return {messages, handleSubmitMessage, isCreatingChat: createChat.isPending};
}
