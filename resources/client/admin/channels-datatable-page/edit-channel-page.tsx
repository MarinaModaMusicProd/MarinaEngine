import {useForm} from 'react-hook-form';
import {CrupdateChannelForm} from './crupdate-channel-page/crupdate-channel-form';
import {useChannel} from '@app/web-player/channels/requests/use-channel';
import React from 'react';
import {Channel} from '@app/web-player/channels/channel';
import {
  UpdateChannelPayload,
  useUpdateChannel,
} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@common/i18n/trans';
import {PageStatus} from '@common/http/page-status';

export function EditChannelPage() {
  const query = useChannel(undefined, {
    normalizeContent: true,
    forAdmin: true,
  });
  if (query.data) {
    return <PageContent channel={query.data.channel} />;
  }
  return <PageStatus query={query} />;
}

interface PageContentProps {
  channel: Channel;
}
function PageContent({channel}: PageContentProps) {
  const form = useForm<UpdateChannelPayload>({
    defaultValues: {
      ...channel,
    },
  });
  const updateChannel = useUpdateChannel(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        updateChannel.mutate(values);
      }}
      title={
        <Trans message="Edit “:name“ channel" values={{name: channel.name}} />
      }
      isLoading={updateChannel.isLoading}
    >
      <CrupdateChannelForm disableSlugEditing={channel.config.lockSlug} />
    </CrupdateResourceLayout>
  );
}
