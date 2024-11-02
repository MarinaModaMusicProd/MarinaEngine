import React from 'react';
import {TRACK_MODEL} from '@app/web-player/tracks/track';
import {CreateChannelPageLayout} from '@common/admin/channels/channel-editor/create-channel-page-layout';
import {ChannelNameField} from '@common/admin/channels/channel-editor/controls/channel-name-field';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {Trans} from '@ui/i18n/trans';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {ContentTypeField} from '@common/admin/channels/channel-editor/controls/content-type-field';
import {channelContentConfig} from '@app/admin/channels/channel-content-config';
import {ContentModelField} from '@common/admin/channels/channel-editor/controls/content-model-field';
import {ContentOrderField} from '@common/admin/channels/channel-editor/controls/content-order-field';
import {ContentLayoutFields} from '@common/admin/channels/channel-editor/controls/content-layout-fields';
import {ChannelEditorTabs} from '@common/admin/channels/channel-editor/channel-editor-tabs';
import {AppChannelAutoUpdateField} from '@app/admin/channels/app-channel-auto-update-field';
import {AppChannelRestrictionField} from '@app/admin/channels/app-channel-restriction-field';

export function CreateChannelPage() {
  return (
    <CreateChannelPageLayout
      defaultValues={{
        contentType: 'listAll',
        contentModel: TRACK_MODEL,
        contentOrder: 'created_at:desc',
        layout: 'trackTable',
        nestedLayout: 'carousel',
        paginationType: 'infiniteScroll',
      }}
    >
      <ChannelEditorTabs>
        <ChannelNameField />
        <FormSwitch
          className="mt-24"
          name="config.hideTitle"
          description={
            <Trans message="Whether title should be shown when displaying this channel on the site." />
          }
        >
          <Trans message="Hide title" />
        </FormSwitch>
        <FormTextField
          name="description"
          label={<Trans message="Description" />}
          inputElementType="textarea"
          rows={2}
          className="my-24"
        />
        <ContentTypeField config={channelContentConfig} />
        <AppChannelAutoUpdateField config={channelContentConfig} />
        <ContentModelField config={channelContentConfig} className="my-24" />
        <AppChannelRestrictionField
          config={channelContentConfig}
          className="mb-24"
        />
        <ContentOrderField config={channelContentConfig} className="mb-24" />
        <ContentLayoutFields config={channelContentConfig} className="mb-24" />
      </ChannelEditorTabs>
    </CreateChannelPageLayout>
  );
}
