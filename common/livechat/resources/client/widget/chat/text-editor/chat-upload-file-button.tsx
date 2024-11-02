import {Fragment, useState} from 'react';
import {Tooltip} from '@ui/tooltip/tooltip';
import {Trans} from '@ui/i18n/trans';
import {IconButton, IconButtonProps} from '@ui/buttons/icon-button';
import {AttachFileIcon} from '@ui/icons/material/AttachFile';
import {useFileUploadStore} from '@common/uploads/uploader/file-upload-provider';
import {Badge} from '@ui/badge/badge';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {openUploadWindow} from '@ui/utils/files/open-upload-window';
import {ChatUploadsDialog} from '@livechat/widget/chat/text-editor/chat-uploads-dialog';

interface Props {
  onSendFiles: () => void;
  className?: string;
  size?: IconButtonProps['size'];
  iconSize?: IconButtonProps['iconSize'];
  maxUploads?: number;
  disabled?: boolean;
}
export function ChatUploadFileButton({
  onSendFiles,
  className,
  size,
  iconSize,
  maxUploads = 6,
  disabled,
}: Props) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const uploads = useFileUploadStore(s => s.fileUploads);
  const uploadMultiple = useFileUploadStore(s => s.uploadMultiple);

  return (
    <Fragment>
      <DialogTrigger
        type="popover"
        mobileType="popover"
        isOpen={dialogIsOpen}
        onOpenChange={isOpen => setDialogIsOpen(isOpen)}
        usePortal={false}
        placement="top"
        offset={14}
        handleTriggerClick={false}
      >
        <Tooltip label={<Trans message="Upload a file" />}>
          <IconButton
            badge={
              uploads.size ? (
                <Badge top="-top-2" right="right-2">
                  {uploads.size}
                </Badge>
              ) : undefined
            }
            onClick={async e => {
              e.stopPropagation();
              if (dialogIsOpen) {
                setDialogIsOpen(false);
              } else {
                if (!uploads.size) {
                  const files = await openUploadWindow({
                    multiple: true,
                  });
                  uploadMultiple(files.slice(0, maxUploads - 1));
                }
                setDialogIsOpen(true);
              }
            }}
            disabled={disabled}
            size={size}
            className={className}
            iconSize={iconSize}
          >
            <AttachFileIcon className="rotate-[30deg]" />
          </IconButton>
        </Tooltip>
        <ChatUploadsDialog
          maxUploads={maxUploads}
          onClose={() => setDialogIsOpen(false)}
          onSendFiles={() => {
            onSendFiles();
            setDialogIsOpen(false);
          }}
        />
      </DialogTrigger>
    </Fragment>
  );
}
