import {useForm} from 'react-hook-form';
import {
  CreateCannedReplyPayload,
  useCreateCannedReply,
} from '@helpdesk/canned-replies/requests/use-create-canned-reply';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {IconButton} from '@ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {Trans} from '@ui/i18n/trans';
import React from 'react';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {CrupdateCannedReplyFormFields} from '@helpdesk/canned-replies/datatable/crupdate-canned-reply-form-fields';

export function CreateCannedReplyPage() {
  const navigate = useNavigate();
  const form = useForm<CreateCannedReplyPayload>({
    defaultValues: {
      shared: true,
      groupId: 1,
    },
  });

  const createCannedReply = useCreateCannedReply(form);

  const handleSubmit = (value: CreateCannedReplyPayload) => {
    createCannedReply.mutate(value, {
      onSuccess: () => {
        navigate('..');
      },
    });
  };

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={handleSubmit}
      title={<Trans message="Create saved reply" />}
      isLoading={createCannedReply.isPending}
      disableSaveWhenNotDirty
      backButton={
        <IconButton elementType={Link} to=".." size="sm" iconSize="md">
          <ArrowBackIcon />
        </IconButton>
      }
    >
      <CrupdateCannedReplyFormFields onSubmit={handleSubmit} form={form} />
    </CrupdateResourceLayout>
  );
}
