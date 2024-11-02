import {useFileUploadStore} from '@common/uploads/uploader/file-upload-provider';
import {ReactElement} from 'react';
import {message} from '@ui/i18n/message';
import {Tooltip} from '@ui/tooltip/tooltip';
import {MixedText} from '@ui/i18n/mixed-text';
import {ErrorIcon} from '@ui/icons/material/Error';
import {WarningIcon} from '@ui/icons/material/Warning';
import {CheckCircleIcon} from '@ui/icons/material/CheckCircle';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {UploadedFile} from '@ui/utils/files/uploaded-file';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {CheckCircleFilledIcon} from '@ui/icons/check-circle-filled';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {Trans} from '@ui/i18n/trans';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {IconButton} from '@ui/buttons/icon-button';
import {openUploadWindow} from '@ui/utils/files/open-upload-window';
import {AddIcon} from '@ui/icons/material/Add';
import {FileThumbnail} from '@common/uploads/components/file-type-icon/file-thumbnail';
import {CloseIcon} from '@ui/icons/material/Close';
import {Button} from '@ui/buttons/button';
import {FileUpload} from '@common/uploads/uploader/file-upload-store';

interface Props {
  onClose: () => void;
  onSendFiles: () => void;
  maxUploads: number;
}
export function ChatUploadsDialog({onClose, onSendFiles, maxUploads}: Props) {
  const uploads = useFileUploadStore(s => s.fileUploads);
  const completedUploadsCount = useFileUploadStore(
    s => s.completedUploadsCount,
  );
  const activeUploadsCount = useFileUploadStore(s => s.activeUploadsCount);
  const uploadMultiple = useFileUploadStore(s => s.uploadMultiple);

  return (
    <Dialog maxHeight="max-h-400" shadow="shadow-lg">
      <DialogHeader
        showDivider
        padding="px-14"
        leftAdornment={
          activeUploadsCount ? (
            <ProgressCircle isIndeterminate size="sm" />
          ) : (
            <CheckCircleFilledIcon className="text-positive" />
          )
        }
        closeButtonSize="md"
        closeButtonIcon={<KeyboardArrowDownIcon />}
      >
        <Trans
          message=":completed of :total uploaded"
          values={{completed: completedUploadsCount, total: uploads.size}}
        />
      </DialogHeader>
      <DialogBody padding="p-14" className="@container">
        <div className="mb-12 grid grid-cols-3 gap-10 @[400px]:grid-cols-4">
          {uploads.size < maxUploads && (
            <IconButton
              equalWidth
              color="primary"
              variant="outline"
              size={null}
              className="aspect-square"
              onClick={async () => {
                const files = await openUploadWindow({
                  multiple: true,
                });
                uploadMultiple(files);
              }}
            >
              <AddIcon />
            </IconButton>
          )}
          {[...uploads].map(([id, upload]) => (
            <FileGridItem
              key={id}
              upload={upload}
              uploadCount={uploads.size}
              onClose={onClose}
            />
          ))}
        </div>
        <Button
          variant="flat"
          color="primary"
          className="w-full"
          onClick={() => onSendFiles()}
          disabled={activeUploadsCount > 0}
        >
          <Trans message="Send files" />
        </Button>
      </DialogBody>
    </Dialog>
  );
}

interface FileGridItemProps {
  upload: FileUpload;
  uploadCount: number;
  onClose: () => void;
}
function FileGridItem({upload, onClose, uploadCount}: FileGridItemProps) {
  const abortUpload = useFileUploadStore(s => s.abortUpload);
  const removeUpload = useFileUploadStore(s => s.removeUpload);

  return (
    <div className="relative flex aspect-square flex-col rounded-panel border px-6 pb-4 pt-6">
      <div className="m-4 flex flex-auto items-center justify-center">
        {upload.entry ? (
          <FileThumbnail file={upload.entry} className="rounded-panel" />
        ) : (
          <InProgressUploadThumbnail file={upload.file} />
        )}
      </div>
      <div className="mt-6 flex-shrink-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-xs">
        {upload.file.name}
      </div>
      <IconButton
        className="absolute -right-8 -top-8"
        variant="flat"
        radius="rounded-full"
        color="chip"
        size="2xs"
        onClick={() => {
          abortUpload(upload.file.id);
          removeUpload(upload.file.id);
          if (uploadCount < 2) {
            onClose();
          }
        }}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

interface InProgressUploadThumbnailProps {
  file: UploadedFile;
}
function InProgressUploadThumbnail({file}: InProgressUploadThumbnailProps) {
  const fileUpload = useFileUploadStore(s => s.fileUploads.get(file.id));
  const percentage = fileUpload?.percentage || 0;
  const status = fileUpload?.status;
  const errorMessage = fileUpload?.errorMessage;

  let statusEl: ReactElement;
  if (status === 'failed') {
    const errMessage =
      errorMessage || message('This file could not be uploaded');
    statusEl = (
      <Tooltip variant="danger" label={<MixedText value={errMessage} />}>
        <ErrorIcon className="text-danger" size="md" />
      </Tooltip>
    );
  } else if (status === 'aborted') {
    statusEl = <WarningIcon className="text-warning" size="md" />;
  } else if (status === 'completed') {
    statusEl = <CheckCircleIcon size="md" className="text-positive" />;
  } else {
    statusEl = (
      <ProgressCircle
        aria-label="Upload progress"
        size="sm"
        value={percentage}
        isIndeterminate={percentage < 1 || percentage > 99}
      />
    );
  }

  return (
    <div className="flex flex-auto items-center justify-center">{statusEl}</div>
  );
}
