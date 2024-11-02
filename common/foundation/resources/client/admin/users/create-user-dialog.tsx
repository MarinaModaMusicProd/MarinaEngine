import {useForm} from 'react-hook-form';
import React from 'react';
import {CreateUserPayload, useCreateUser} from './requests/create-user';
import {FileUploadProvider} from '../../uploads/uploader/file-upload-provider';
import {Trans} from '@ui/i18n/trans';
import {FormImageSelector} from '@common/uploads/components/image-selector';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {Form} from '@ui/forms/form';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {Button} from '@ui/buttons/button';

export function CreateUserDialog() {
  const form = useForm<CreateUserPayload>();
  const createUser = useCreateUser(form);
  const navigate = useNavigate();
  const {close, formId} = useDialogContext();

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Create user" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values => {
            createUser.mutate(values, {
              onSuccess: r => {
                close();
                navigate(`${r.user.id}/details`, {replace: true});
              },
            });
          }}
        >
          <FileUploadProvider>
            <FormImageSelector
              className="mb-24"
              name="image"
              diskPrefix="avatars"
              label={<Trans message="Avatar" />}
              showRemoveButton
            />
          </FileUploadProvider>
          <FormTextField
            required
            className="mb-24"
            name="email"
            type="email"
            label={<Trans message="Email" />}
          />
          <FormTextField
            className="mb-24"
            name="first_name"
            label={<Trans message="First name" />}
          />
          <FormTextField
            className="mb-24"
            name="last_name"
            label={<Trans message="Last name" />}
          />
          <FormTextField
            required
            name="password"
            type="password"
            label={<Trans message="Password" />}
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          disabled={createUser.isPending}
        >
          <Trans message="Create" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
