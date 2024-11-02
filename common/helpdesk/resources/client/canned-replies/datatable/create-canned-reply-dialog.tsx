import {useForm} from 'react-hook-form';
import {
  CreateCannedReplyPayload,
  useCreateCannedReply,
} from '@helpdesk/canned-replies/requests/use-create-canned-reply';
import {Trans} from '@ui/i18n/trans';
import {CrupdateCannedReplyFormFields} from '@helpdesk/canned-replies/datatable/crupdate-canned-reply-form-fields';
import React, {useState} from 'react';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {Form} from '@ui/forms/form';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';

interface Props {
  getInitialData?: () => Partial<CreateCannedReplyPayload>;
}
export function CreateCannedReplyDialog({getInitialData}: Props) {
  const [initialData] = useState(() => getInitialData?.());
  const {close, formId} = useDialogContext();
  const form = useForm<CreateCannedReplyPayload>({
    defaultValues: {
      shared: true,
      groupId: 1,
      ...initialData,
    },
  });

  const createCannedReply = useCreateCannedReply(form);

  const handleSubmit = (value: CreateCannedReplyPayload) => {
    createCannedReply.mutate(value, {
      onSuccess: () => {
        toast(message('Reply created'));
        close();
      },
    });
  };

  return (
    <Dialog size="fullscreen">
      <DialogHeader>
        <Trans message="New saved reply" />
      </DialogHeader>
      <DialogBody>
        <Form id={formId} form={form} onSubmit={handleSubmit}>
          <CrupdateCannedReplyFormFields onSubmit={handleSubmit} form={form} />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          type="submit"
          variant="flat"
          color="primary"
          form={formId}
          disabled={createCannedReply.isPending}
        >
          <Trans message="Create" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
