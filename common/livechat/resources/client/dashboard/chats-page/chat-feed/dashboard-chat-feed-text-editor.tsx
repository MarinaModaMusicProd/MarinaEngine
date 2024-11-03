import {Chat} from '@livechat/widget/chat/chat';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import {useRef, useState} from 'react';
import {useTrans} from '@ui/i18n/use-trans';
import {useSubmitChatMessage} from '@livechat/widget/chat/use-submit-chat-message';
import {dashboardChatMessagesQueryKey} from '@livechat/dashboard/chats-page/chat-feed/use-dashboard-chat-messages';
import {IconButton} from '@ui/buttons/icon-button';
import {ChatUploadFileButton} from '@livechat/widget/chat/text-editor/chat-upload-file-button';
import {useFileUploadStore} from '@common/uploads/uploader/file-upload-provider';
import {ChatEmojiPickerButton} from '@livechat/widget/chat/text-editor/chat-emoji-picker-button';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {ArticleIcon} from '@ui/icons/material/Article';
import clsx from 'clsx';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {ChatBubbleIcon} from '@livechat/widget/chat/icons/chat-bubble-icon';
import {HashIcon} from '@livechat/widget/chat/icons/hash-icon';
import {WandSparkleIcon} from '@livechat/widget/chat/icons/wand-sparkle-icon';
import {Tooltip} from '@ui/tooltip/tooltip';
import {useAutoFocus} from '@ui/focus/use-auto-focus';

interface Props {
  chat: Chat;
}
export function DashboardChatFeedTextEditor({chat}: Props) {
  const {trans} = useTrans();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [messageType, setMessageType] = useState<'message' | 'note'>('message');
  const [body, setBody] = useState('');
  const submitMessage = useSubmitChatMessage(
    dashboardChatMessagesQueryKey(chat.id),
  );

  const completedUploadsCount = useFileUploadStore(
    s => s.completedUploadsCount,
  );
  const getCompletedUploads = useFileUploadStore(
    s => s.getCompletedFileEntries,
  );
  const clearInactiveUploads = useFileUploadStore(s => s.clearInactive);

  const handleSubmit = () => {
    submitMessage.mutate({
      chatId: chat.id,
      body,
      author: 'agent',
      type: messageType,
      files: getCompletedUploads(),
    });
    setBody('');
    clearInactiveUploads();
  };

  useAutoFocus({autoFocus: true}, textAreaRef);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
      className={clsx(
        'm-16 flex h-110 flex-shrink-0 flex-col rounded-input border pr-10 shadow-sm transition-shadow focus-within:border-primary/60 focus-within:ring focus-within:ring-primary/focus',
        messageType === 'note' && 'bg-note dark:bg-transparent',
      )}
    >
      <textarea
        ref={textAreaRef}
        required={!completedUploadsCount}
        value={body}
        onChange={e => setBody(e.target.value)}
        className="w-full flex-auto resize-none bg-transparent pl-16 pt-16 text-sm outline-none"
        placeholder={
          messageType === 'message'
            ? trans({message: 'Type a message...'})
            : trans({
                message:
                  'Type an internal note, customer will not see this message...',
              })
        }
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="flex h-40 flex-shrink-0 items-center gap-8 pb-4 pl-10">
        <div className="border-r">
          <MessageTypeSelector
            type={messageType}
            onTypeChange={newType => setMessageType(newType)}
          />
        </div>
        <IconButton size="xs" iconSize="sm">
          <HashIcon />
        </IconButton>
        <ChatUploadFileButton
          size="xs"
          iconSize="sm"
          maxUploads={8}
          onSendFiles={() => handleSubmit()}
        />
        <ChatEmojiPickerButton
          onSelected={emoji => setBody(body + emoji)}
          size="xs"
          iconSize="sm"
        />
        <Tooltip label={<Trans message="Enhance text" />}>
          <IconButton size="xs" iconSize="sm">
            <WandSparkleIcon />
          </IconButton>
        </Tooltip>
        <Button
          type="submit"
          variant="flat"
          color="primary"
          size="xs"
          className="mb-4 ml-auto"
          disabled={submitMessage.isPending}
        >
          <Trans message="Send" />
        </Button>
      </div>
    </form>
  );
}

interface MessageTypeSelectorProps {
  type: 'message' | 'note';
  onTypeChange: (type: 'message' | 'note') => void;
}

function MessageTypeSelector({type, onTypeChange}: MessageTypeSelectorProps) {
  return (
    <MenuTrigger placement="top" offset={8}>
      <Button
        sizeClassName="pl-14 pr-6 h-30 text-sm mr-8"
        startIcon={
          type === 'message' ? <ChatBubbleIcon size="xs" /> : <ArticleIcon />
        }
        endIcon={<KeyboardArrowDownIcon />}
      >
        {type === 'message' ? (
          <Trans message="Message" />
        ) : (
          <Trans message="Note" />
        )}
      </Button>
      <Menu>
        <Item
          value="message"
          onClick={() => onTypeChange('message')}
          startIcon={<ChatBubbleIcon size="sm" />}
        >
          <Trans message="Message" />
        </Item>
        <Item
          value="note"
          onClick={() => onTypeChange('note')}
          startIcon={<ArticleIcon />}
        >
          <Trans message="Note" />
        </Item>
      </Menu>
    </MenuTrigger>
  );
}
