import {FileEntry} from '@common/uploads/file-entry';
import {useFileUploadStore} from '@common/uploads/uploader/file-upload-provider';
import React, {useRef, useState} from 'react';
import {useTrans} from '@ui/i18n/use-trans';
import {ChatEmojiPickerButton} from '@livechat/widget/chat/text-editor/chat-emoji-picker-button';
import {ChatUploadFileButton} from '@livechat/widget/chat/text-editor/chat-upload-file-button';
import {Tooltip} from '@ui/tooltip/tooltip';
import {Trans} from '@ui/i18n/trans';
import {IconButton} from '@ui/buttons/icon-button';
import {SendIcon} from '@ui/icons/material/Send';
import {useSettings} from '@ui/settings/use-settings';
import {useAppearanceEditorMode} from '@common/admin/appearance/commands/use-appearance-editor-mode';

interface Props {
  isLoading: boolean;
  onSubmit: (data: {body: string; files: FileEntry[]}) => void;
}
export function WidgetChatTextEditor({isLoading, onSubmit}: Props) {
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {chatWidget} = useSettings();
  const completedUploadsCount = useFileUploadStore(
    s => s.completedUploadsCount,
  );
  const getCompletedUploads = useFileUploadStore(
    s => s.getCompletedFileEntries,
  );
  const clearInactiveUploads = useFileUploadStore(s => s.clearInactive);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState('');
  const {trans} = useTrans();

  const handleSubmit = () => {
    if (!isAppearanceEditorActive) {
      onSubmit({
        body: value,
        files: getCompletedUploads(),
      });
    }
    setValue('');
    clearInactiveUploads();
  };

  return (
    <form
      ref={formRef}
      className="m-0 flex-shrink-0 overflow-hidden"
      onSubmit={e => {
        e.stopPropagation();
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div
        ref={inputContainerRef}
        className="flex items-start justify-center gap-2 border-t p-6 shadow-[0px_41px_20px_40px_rgba(0,0,0,0.05)]"
      >
        <div className="relative max-h-[6em] min-h-36 min-w-0 flex-auto">
          <textarea
            disabled={isLoading}
            required={!completedUploadsCount}
            className="compact-scrollbar absolute inset-0 max-h-inherit resize-none border-none p-8 text-sm text outline-none"
            value={value}
            rows={1}
            onChange={e => setValue(e.target.value)}
            placeholder={trans({
              message: chatWidget?.inputPlaceholder ?? '',
            })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="invisible max-h-inherit whitespace-pre-line p-8 text-sm">
            {value}
          </div>
        </div>
        <ChatEmojiPickerButton
          onSelected={emoji => setValue(value + emoji)}
          className="text-muted"
          size="sm"
          iconSize="md"
        />
        <ChatUploadFileButton
          onSendFiles={() => handleSubmit()}
          className="text-muted"
          size="sm"
          iconSize="md"
          disabled={isAppearanceEditorActive}
        />
        <Tooltip label={<Trans message="Submit" />}>
          <IconButton
            disabled={isLoading || isAppearanceEditorActive}
            type="submit"
            size="sm"
            color="primary"
            iconSize="md"
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </div>
    </form>
  );
}
