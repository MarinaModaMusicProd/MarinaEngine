import {FileUpload} from '@common/uploads/uploader/file-upload-store';
import {ProgressBar} from '@ui/progress/progress-bar';
import React, {ComponentPropsWithoutRef, ReactElement} from 'react';
import {useFileUploadStore} from '@common/uploads/uploader/file-upload-provider';
import {message} from '@ui/i18n/message';
import {Tooltip} from '@ui/tooltip/tooltip';
import {MixedText} from '@ui/i18n/mixed-text';
import {ErrorIcon} from '@ui/icons/material/Error';
import {WarningIcon} from '@ui/icons/material/Warning';
import {CheckCircleIcon} from '@ui/icons/material/CheckCircle';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {AnimatePresence, m} from 'framer-motion';
import {TrackUploadStatusText} from '@app/admin/tracks-datatable-page/track-form/track-upload-status-text';

export type TrackUploadStatus = FileUpload['status'] | 'processing' | undefined;

interface UploadProgressProps {
  fileUpload: FileUpload;
  status: TrackUploadStatus;
  onAbort?: (uploadId: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}
export function TrackUploadProgress({
  fileUpload,
  status,
  onAbort,
  size = 'md',
  className,
}: UploadProgressProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-24">
        <TrackUploadStatusText fileUpload={fileUpload} status={status} />
        <UploadStatusButton
          fileUpload={fileUpload}
          status={status}
          onAbort={onAbort}
        />
      </div>
      <ProgressBar
        size={size === 'sm' ? 'xs' : 'sm'}
        radius="rounded-sm"
        value={fileUpload.percentage}
        isIndeterminate={status === 'processing' || status === 'pending'}
      />
    </div>
  );
}

function UploadStatusButton({
  fileUpload,
  status,
  onAbort,
}: UploadProgressProps) {
  const abortUpload = useFileUploadStore(s => s.abortUpload);
  const clearInactive = useFileUploadStore(s => s.clearInactive);
  const errorMessage = fileUpload.errorMessage;

  let statusButton: ReactElement;
  if (status === 'failed') {
    const errMessage =
      errorMessage || message('This file could not be uploaded');
    statusButton = (
      <AnimatedStatus>
        <Tooltip variant="danger" label={<MixedText value={errMessage} />}>
          <ErrorIcon className="text-danger" size="sm" />
        </Tooltip>
      </AnimatedStatus>
    );
  } else if (status === 'aborted') {
    statusButton = (
      <AnimatedStatus>
        <WarningIcon className="text-warning" size="sm" />
      </AnimatedStatus>
    );
  } else if (status === 'completed' || status === 'processing') {
    statusButton = (
      <AnimatedStatus>
        <CheckCircleIcon size="sm" className="text-primary" />
      </AnimatedStatus>
    );
  } else if (onAbort) {
    statusButton = (
      <AnimatedStatus>
        <IconButton size="xs" onClick={() => onAbort(fileUpload.file.id)}>
          <CloseIcon />
        </IconButton>
      </AnimatedStatus>
    );
  } else {
    // keep the spacing, even if status button is hidden
    statusButton = <div className="h-30 w-30" />;
  }

  return <AnimatePresence>{statusButton}</AnimatePresence>;
}

interface AnimatedStatusProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
  > {
  children: ReactElement;
}
function AnimatedStatus({children, ...domProps}: AnimatedStatusProps) {
  return (
    <m.div
      className="flex h-30 w-30 items-center justify-center"
      {...domProps}
      initial={{scale: 0, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      exit={{scale: 0, opacity: 0}}
    >
      {children}
    </m.div>
  );
}
