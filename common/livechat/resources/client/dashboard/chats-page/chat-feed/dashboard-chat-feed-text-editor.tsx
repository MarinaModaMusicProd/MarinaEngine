import {Chat} from '@livechat/widget/chat/chat';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {WandSparkleIcon} from '@common/ai/wand-sparkle-icon';
import {Tooltip} from '@ui/tooltip/tooltip';
import {useAutoFocus} from '@ui/focus/use-auto-focus';
import {CannedRepliesDialogTrigger} from '@helpdesk/canned-replies/canned-replies-dialog-trigger';
import {useSyncTaggableTags} from '@common/tags/use-sync-taggable-tags';
import {useRequiredParams} from '@common/ui/navigation/use-required-params';
import {useCannedReplies} from '@helpdesk/canned-replies/requests/use-canned-replies';
import {CannedReplyInlineSuggestions} from '@helpdesk/canned-replies/inline-suggestions/canned-reply-inline-suggestions';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {useSettings} from '@ui/settings/use-settings';
import {ModifyTextWithAiPopup} from '@common/ai/modify-text-with-ai/modify-text-with-ai-popup';

// todo: show total agent count instead of agents online in group index page, if websockets are not setup

interface Props {
  chat: Chat;
}
export function DashboardChatFeedTextEditor({chat}: Props) {
  // preload canned replies
  const {ai_setup} = useSettings();
  useCannedReplies();
  const {trans} = useTrans();
  const contentEditableElRef = useRef<HTMLDivElement>(null);
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

  const isDisabled =
    submitMessage.isPending || (!body && !completedUploadsCount);

  useAutoFocus({autoFocus: true}, contentEditableElRef);

  // only set textContent if it's different from the
  // current body to avoid caret from jumping around
  useEffect(() => {
    const el = contentEditableElRef.current;
    if (el && body !== el.textContent) {
      // use execCommand instead of textContent so built-in browser undo stack works
      contentEditableElRef.current.focus();
      document.execCommand('selectAll', false);
      document.execCommand('insertText', false, body);
    }
  }, [body]);

  return (
    <div
      className={clsx(
        'mx-16 mb-6 mt-16 flex max-h-264 min-h-110 flex-shrink-0 flex-col rounded-input border shadow-sm transition-shadow focus-within:border-primary/60 focus-within:ring focus-within:ring-primary/focus',
        messageType === 'note' && 'bg-note dark:bg-transparent',
      )}
    >
      <div
        ref={contentEditableElRef}
        onInput={e => setBody(e.currentTarget.textContent || '')}
        contentEditable
        className="content-editable-placeholder compact-scrollbar w-full flex-auto overflow-y-auto bg-transparent px-16 pt-16 text-sm outline-none"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        data-placeholder={
          messageType === 'message'
            ? trans({message: 'Type a message...'})
            : trans({
                message:
                  'Type an internal note, customer will not see this message...',
              })
        }
      />
      <div className="flex h-40 flex-shrink-0 items-center gap-8 px-10 pb-4">
        <div className="border-r">
          <MessageTypeSelector
            type={messageType}
            onTypeChange={newType => setMessageType(newType)}
          />
        </div>
        <CannedReplyTrigger
          setBody={setBody}
          contentEditableElRef={contentEditableElRef}
        />
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
        {ai_setup && (
          <DialogTrigger type="popover" placement="top" offset={14}>
            <Tooltip label={<Trans message="Enhance text" />}>
              <IconButton size="xs" iconSize="sm">
                <WandSparkleIcon />
              </IconButton>
            </Tooltip>
            <ModifyTextWithAiPopup
              onModify={async handler => setBody(await handler(body))}
            />
          </DialogTrigger>
        )}
        <Button
          variant="flat"
          color="primary"
          size="xs"
          className="mb-4 ml-auto"
          disabled={isDisabled}
          onClick={() => handleSubmit()}
        >
          <Trans message="Send" />
        </Button>
      </div>
    </div>
  );
}

interface CannedReplyTriggerProps {
  setBody: Dispatch<SetStateAction<string>>;
  contentEditableElRef: React.RefObject<HTMLDivElement>;
}
function CannedReplyTrigger({
  setBody,
  contentEditableElRef,
}: CannedReplyTriggerProps) {
  const {chatId} = useRequiredParams(['chatId']);
  const syncTags = useSyncTaggableTags();
  const addUpload = useFileUploadStore(s => s.addCompletedFileUpload);

  const applyCannedReply = (reply: CannedReply, text?: string) => {
    reply.attachments?.forEach(attachment => {
      addUpload(attachment);
    });
    setBody(prev => {
      if (text != null) {
        prev = prev.replace(`#${text}`, reply.body);
      }
      return prev + reply.body;
    });
    if (reply.tags?.length) {
      syncTags.mutate({
        taggableIds: [chatId],
        taggableType: 'chat',
        tagIds: reply.tags.map(t => t.id),
        detach: false,
      });
    }
  };

  return (
    <Fragment>
      <CannedRepliesDialogTrigger
        onSelected={reply => applyCannedReply(reply)}
        placement="top-start"
      >
        <IconButton size="xs" iconSize="sm">
          <HashIcon />
        </IconButton>
      </CannedRepliesDialogTrigger>
      <CannedReplyInlineSuggestions
        onSelected={(text, reply) => applyCannedReply(reply, text)}
        contentEditableElRef={contentEditableElRef}
      />
    </Fragment>
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
