import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {Trans} from '@ui/i18n/trans';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {Form} from '@ui/forms/form';
import {FormDatePicker} from '@ui/forms/input-field/date/date-picker/date-picker';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {useBanVisitor} from '@livechat/dashboard/visitors/use-ban-visitor';
import React from 'react';
import {useForm} from 'react-hook-form';
import {CreateBanPayload} from '@common/admin/users/requests/use-ban-user';

interface Props {
  visitorId: number | string;
  chatId?: number | string;
}
export function BanVisitorDialog({visitorId, chatId}: Props) {
  const {trans} = useTrans();
  const {close, formId} = useDialogContext();
  const form = useForm<CreateBanPayload>({
    defaultValues: {
      permanent: true,
    },
  });
  const isPermanent = form.watch('permanent');
  const banVisitor = useBanVisitor(form, visitorId, chatId);
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Suspend customer" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values =>
            banVisitor.mutate(values, {
              onSuccess: () => close(true),
            })
          }
        >
          <FormDatePicker
            name="ban_until"
            label={<Trans message="Suspend until" />}
            disabled={isPermanent}
          />
          <FormSwitch name="permanent" className="mt-12">
            <Trans message="Permanent" />
          </FormSwitch>
          <FormTextField
            className="mt-24"
            name="comment"
            inputElementType="textarea"
            maxLength={250}
            label={<Trans message="Reason" />}
            placeholder={trans(message('Optional'))}
          />
        </Form>
        <div className="mt-16">
          <Trans message="Suspended customers will not see your chat widget, appear in the traffic list or receive campaigns." />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          form={formId}
          variant="flat"
          color="primary"
          type="submit"
          disabled={banVisitor.isPending}
        >
          <Trans message="Suspend" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
