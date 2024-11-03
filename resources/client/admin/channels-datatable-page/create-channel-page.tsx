import {useForm} from 'react-hook-form';
import {CrupdateChannelForm} from './crupdate-channel-page/crupdate-channel-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import React from 'react';
import {useCreateChannel} from '@app/admin/channels-datatable-page/requests/use-create-channel';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@common/i18n/trans';
import {TRACK_MODEL} from '@app/web-player/tracks/track';
import {EMPTY_PAGINATION_RESPONSE} from '@common/http/backend-response/pagination-response';

export function CreateChannelPage() {
  const form = useForm<UpdateChannelPayload>({
    defaultValues: {
      content: EMPTY_PAGINATION_RESPONSE.pagination,
      config: {
        contentType: 'listAll',
        contentModel: TRACK_MODEL,
        contentOrder: 'created_at:desc',
        layout: 'trackTable',
        carouselWhenNested: true,
      },
    },
  });
  const createChannel = useCreateChannel(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createChannel.mutate(values);
      }}
      title={<Trans message="Add new channel" />}
      isLoading={createChannel.isLoading}
    >
      <CrupdateChannelForm />
    </CrupdateResourceLayout>
  );
}
