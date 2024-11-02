import React from 'react';
import {useFileUploadStore} from '@common/uploads/uploader/file-upload-provider';
import {FileEntry} from '@common/uploads/file-entry';
import {
  AttachmentLayout,
  ConversationAttachmentListLayout,
  FileEntryAttachmentLayout,
} from '@helpdesk/attachments/conversation-attachment-list-layout';

interface Props {
  attachments: FileEntry[];
  onRemove: (attachment: FileEntry) => void;
}
export function ConversationReplyEditorAttachments({
  attachments,
  onRemove,
}: Props) {
  const uploads = useFileUploadStore(s => s.fileUploads);
  const abortUpload = useFileUploadStore(s => s.abortUpload);
  return (
    <ConversationAttachmentListLayout className="mb-8">
      {attachments.map((attachment, index) => (
        <FileEntryAttachmentLayout
          key={attachment.id}
          attachments={attachments}
          index={index}
          onRemove={() => onRemove(attachment)}
        />
      ))}
      {[...uploads.entries()]
        .filter(([_, upload]) => upload.status === 'inProgress')
        .map(([id, upload]) => (
          <AttachmentLayout
            key={id}
            size={upload.file.size}
            name={upload.file.name}
            mime={upload.file.mime}
            progress={upload.percentage}
            onRemove={() => abortUpload(id)}
          />
        ))}
    </ConversationAttachmentListLayout>
  );
}
