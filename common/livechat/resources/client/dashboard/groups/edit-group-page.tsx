import {useForm} from 'react-hook-form';
import {Trans} from '@ui/i18n/trans';
import {
  UpdateGroupPayload,
  useUpdateGroup,
} from '@livechat/dashboard/groups/requests/use-update-group';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {FullPageLoader} from '@ui/progress/full-page-loader';
import {useGroup} from '@livechat/dashboard/groups/requests/use-group';
import {Group} from '@helpdesk/groups/group';
import React from 'react';
import {CrupdateGroupFormContent} from '@livechat/dashboard/groups/crupdate-group-form/crupdate-group-form-content';
import {IconButton} from '@ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {CrupdateGroupSectionHeader} from '@livechat/dashboard/groups/crupdate-group-form/crupdate-group-section-header';
import {Button} from '@ui/buttons/button';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {DeleteGroupDialog} from '@livechat/dashboard/groups/delete-group-dialog';
import {InfoIcon} from '@ui/icons/material/Info';
import {useNavigate} from '@common/ui/navigation/use-navigate';

export function EditGroupPage() {
  const query = useGroup();

  if (query.status !== 'success') {
    return <FullPageLoader />;
  }

  return <PageContent group={query.data.group} />;
}

interface Props {
  group: Group;
}
function PageContent({group}: Props) {
  const navigate = useNavigate();
  const form = useForm<UpdateGroupPayload>({
    defaultValues: {
      name: group.name,
      users: group.users,
      chat_assignment_mode: group.chat_assignment_mode ?? 'auto',
    },
  });
  const updateGroup = useUpdateGroup(form);

  return (
    <CrupdateResourceLayout
      variant="popup"
      form={form}
      onSubmit={values => {
        updateGroup.mutate(values);
      }}
      title={<Trans message="Edit “:name“ group" values={{name: group.name}} />}
      isLoading={updateGroup.isPending}
      disableSaveWhenNotDirty
      submitButtonText={<Trans message="Save changes" />}
      backButton={
        <IconButton elementType={Link} to="../.." relative="path">
          <ArrowBackIcon />
        </IconButton>
      }
    >
      <CrupdateGroupFormContent group={group} />
      {group.default && (
        <div className="mt-44 flex items-center gap-8 text-sm text-muted">
          <InfoIcon size="sm" />
          <Trans message="All agents belong to this group." />
        </div>
      )}
      {!group.default && (
        <div className="mt-44">
          <CrupdateGroupSectionHeader margin="mb-4">
            <Trans message="Delete group" />
          </CrupdateGroupSectionHeader>
          <div className="mb-24 text-sm">
            <Trans message="Group members and associated conversations will not be deleted." />
          </div>
          <DialogTrigger type="modal">
            <Button color="danger" variant="outline" size="xs">
              <Trans message="Delete group" />
            </Button>
            <DeleteGroupDialog
              groupId={group.id}
              onDeleted={() => {
                navigate('../..', {relative: 'path'});
              }}
            />
          </DialogTrigger>
        </div>
      )}
    </CrupdateResourceLayout>
  );
}
