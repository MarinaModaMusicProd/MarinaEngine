import {useForm} from 'react-hook-form';
import {Trans} from '@ui/i18n/trans';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import React from 'react';
import {CrupdateGroupFormContent} from '@livechat/dashboard/groups/crupdate-group-form/crupdate-group-form-content';
import {IconButton} from '@ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {
  CreateGroupPayload,
  useCreateGroup,
} from '@livechat/dashboard/groups/requests/use-create-group';

export function CreateGroupPage() {
  const form = useForm<CreateGroupPayload>({
    defaultValues: {
      chat_assignment_mode: 'auto',
      users: [],
    },
  });
  const createGroup = useCreateGroup(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createGroup.mutate(values);
      }}
      title={<Trans message="Create new group" />}
      isLoading={createGroup.isPending}
      submitButtonText={<Trans message="Create" />}
      backButton={
        <IconButton elementType={Link} to="../" relative="path">
          <ArrowBackIcon />
        </IconButton>
      }
    >
      <CrupdateGroupFormContent />
    </CrupdateResourceLayout>
  );
}
