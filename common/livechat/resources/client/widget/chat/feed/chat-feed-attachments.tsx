import {FileThumbnail} from '@common/uploads/components/file-type-icon/file-thumbnail';
import {ChatFeedBubble} from '@livechat/widget/chat/feed/chat-feed-bubble';
import {AttachFileIcon} from '@ui/icons/material/AttachFile';
import {FormattedBytes} from '@ui/i18n/formatted-bytes';
import {ChatMessageAttachment} from '@livechat/widget/chat/chat';
import clsx from 'clsx';
import {FileEntryUrlsContext} from '@common/uploads/file-entry-urls';

const previewSearchParams = {
  policy: 'chatFileEntry',
};

interface Props {
  onSelected?: (file: ChatMessageAttachment) => void;
  attachments: ChatMessageAttachment[];
  alignRight: boolean;
  color: 'chip' | 'primary';
}
export function ChatFeedAttachments({
  attachments,
  alignRight,
  color,
  onSelected,
}: Props) {
  const images: ChatMessageAttachment[] = [];
  const files: ChatMessageAttachment[] = [];
  attachments.forEach(attachment => {
    if (attachment.type === 'image') {
      images.push(attachment);
    } else {
      files.push(attachment);
    }
  });

  return (
    <FileEntryUrlsContext.Provider value={previewSearchParams}>
      {images.length > 0 && (
        <div
          className={clsx(
            'mb-8 flex flex-wrap items-center gap-8',
            alignRight && 'justify-end',
          )}
        >
          {images.map(image => (
            <div
              key={image.id}
              className="transition:button flex h-80 w-100 cursor-pointer items-center justify-center overflow-hidden rounded-panel border p-6 hover:bg-hover"
              onClick={() => onSelected?.(image)}
            >
              <FileThumbnail file={image} className="rounded-panel" />
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="mb-8 space-y-6">
          {files.map(file => (
            <ChatFeedBubble
              key={file.id}
              className="flex cursor-pointer gap-2 underline"
              alignRight={alignRight}
              color={color}
              onClick={() => onSelected?.(file)}
            >
              <AttachFileIcon size="xs" />
              {file.name} (<FormattedBytes bytes={file.file_size} />)
            </ChatFeedBubble>
          ))}
        </div>
      )}
    </FileEntryUrlsContext.Provider>
  );
}
