import {useBlocker} from 'react-router-dom';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {Trans} from '@ui/i18n/trans';
import {useEffect} from 'react';

interface Props {
  isBlocked: boolean;
  allowedPath?: string;
}
export function BlockerDialog({isBlocked, allowedPath}: Props) {
  const {state, reset, proceed} = useBlocker(({nextLocation}) => {
    return (
      isBlocked &&
      // only block navigation if specified path is not within next location
      (!allowedPath || !nextLocation.pathname.includes(allowedPath))
    );
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isBlocked) {
        e.preventDefault();
        e.returnValue = true;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isBlocked]);

  return (
    <DialogTrigger
      type="modal"
      isOpen={state === 'blocked'}
      onClose={isConfirmed => {
        if (state !== 'blocked') return;
        if (isConfirmed) {
          proceed();
        } else {
          reset();
        }
      }}
    >
      <ConfirmationDialog
        isDanger
        title={<Trans message="You have unsaved changes" />}
        body={
          <Trans message="Your changes will be lost if you continue. Are you sure you want to discard them?" />
        }
        close={<Trans message="Stay here" />}
        confirm={<Trans message="Discard changes" />}
      />
    </DialogTrigger>
  );
}
