import {UseFormReturn} from 'react-hook-form';
import {ReactNode} from 'react';
import {Form} from '@ui/forms/form';
import {DirtyFormSaveDrawer} from '@common/admin/crupdate-resource-layout';
import {
  UpdateUserPayload,
  useUpdateUser,
} from '@common/admin/users/requests/user-update-user';
import {useOutletContext} from 'react-router-dom';
import {User} from '@ui/types/user';

interface Props {
  form: UseFormReturn<Partial<UpdateUserPayload>>;
  children: ReactNode;
}
export function UpdateUserForm({form, children}: Props) {
  const user = useOutletContext() as User;
  const updateUser = useUpdateUser(user.id, form);
  return (
    <Form
      onSubmit={values => {
        updateUser.mutate(values);
      }}
      onBeforeSubmit={() => form.clearErrors()}
      form={form}
    >
      {children}
      <DirtyFormSaveDrawer isLoading={updateUser.isPending} />
    </Form>
  );
}
