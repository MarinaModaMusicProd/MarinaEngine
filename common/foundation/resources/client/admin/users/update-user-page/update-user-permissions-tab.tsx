import {CrupdateResourceSection} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@ui/i18n/trans';
import {FormPermissionSelector} from '@common/auth/ui/permission-selector';
import React from 'react';
import {UserRoleSection} from '@common/admin/users/update-user-page/user-role-section';
import {useOutletContext} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {User} from '@ui/types/user';
import {UpdateUserPayload} from '@common/admin/users/requests/user-update-user';
import {UpdateUserForm} from '@common/admin/users/update-user-page/update-user-form';

export function UpdateUserPermissionsTab() {
  const user = useOutletContext() as User;
  const form = useForm<UpdateUserPayload>({
    defaultValues: {
      permissions: user.permissions,
      roles: user.roles,
    },
  });
  return (
    <UpdateUserForm form={form}>
      <UserRoleSection />
      <CrupdateResourceSection label={<Trans message="Permissions" />}>
        <FormPermissionSelector name="permissions" />
      </CrupdateResourceSection>
    </UpdateUserForm>
  );
}
