import {useForm} from 'react-hook-form';
import {CreateCannedReplyPayload} from '@helpdesk/canned-replies/requests/use-create-canned-reply';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {IconButton} from '@ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {Trans} from '@ui/i18n/trans';
import React, {Fragment} from 'react';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {PageStatus} from '@common/http/page-status';
import {useCannedReply} from '@helpdesk/canned-replies/requests/use-canned-reply';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {useUpdateCannedReply} from '@helpdesk/canned-replies/requests/use-update-canned-reply';
import {CrupdateCannedReplyFormFields} from '@helpdesk/canned-replies/datatable/crupdate-canned-reply-form-fields';
import {useHelpdeskGroupsAutocomplete} from '@helpdesk/groups/requests/use-helpdesk-groups-autocomplete';

export function UpdateCannedReplyPage() {
  const query = useCannedReply();
  const groupQuery = useHelpdeskGroupsAutocomplete();

  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="Edit canned reply" />
      </StaticPageTitle>
      {query.data?.reply && groupQuery.data ? (
        <PageContent cannedReply={query.data.reply} />
      ) : (
        <PageStatus
          query={query}
          isLoading={query.isLoading || groupQuery.isLoading}
        />
      )}
    </Fragment>
  );
}

interface PageContentProps {
  cannedReply: CannedReply;
}
function PageContent({cannedReply}: PageContentProps) {
  const navigate = useNavigate();
  const form = useForm<CreateCannedReplyPayload>({
    defaultValues: {
      name: cannedReply.name,
      body: cannedReply.body,
      attachments: cannedReply.attachments,
      shared: cannedReply.shared,
      groupId: cannedReply.group_id,
      tags: cannedReply.tags,
    },
  });

  const updateCannedReply = useUpdateCannedReply(form, cannedReply.id);

  const handleSubmit = (value: CreateCannedReplyPayload) => {
    updateCannedReply.mutate(value, {
      onSuccess: () => {
        navigate('../..', {relative: 'path'});
      },
    });
  };

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={handleSubmit}
      title={<Trans message="Update saved reply" />}
      isLoading={updateCannedReply.isPending}
      disableSaveWhenNotDirty
      backButton={
        <IconButton
          elementType={Link}
          to="../.."
          size="sm"
          iconSize="md"
          relative="path"
        >
          <ArrowBackIcon />
        </IconButton>
      }
    >
      <CrupdateCannedReplyFormFields onSubmit={handleSubmit} form={form} />
    </CrupdateResourceLayout>
  );
}
