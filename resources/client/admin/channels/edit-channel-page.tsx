import React, {Fragment} from 'react';
import {EditChannelPageLayout} from '@common/admin/channels/channel-editor/edit-channel-page-layout';
import {ChannelNameField} from '@common/admin/channels/channel-editor/controls/channel-name-field';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {ContentTypeField} from '@common/admin/channels/channel-editor/controls/content-type-field';
import {channelContentConfig} from '@app/admin/channels/channel-content-config';
import {ContentModelField} from '@common/admin/channels/channel-editor/controls/content-model-field';
import {ContentOrderField} from '@common/admin/channels/channel-editor/controls/content-order-field';
import {ContentLayoutFields} from '@common/admin/channels/channel-editor/controls/content-layout-fields';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {DescriptionIcon} from '@ui/icons/material/Description';
import {InfoDialogTrigger} from '@ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {SettingsIcon} from '@ui/icons/material/Settings';
import {DashboardIcon} from '@ui/icons/material/Dashboard';
import {ChannelPaginationTypeField} from '@common/admin/channels/channel-editor/controls/channel-pagination-type-field';
import {PublicIcon} from '@ui/icons/material/Public';
import {ChannelSeoFields} from '@common/admin/channels/channel-editor/controls/channel-seo-fields';
import {ChannelContentEditor} from '@common/admin/channels/channel-editor/channel-content-editor';
import {
  ChannelContentSearchField,
  ChannelContentSearchFieldProps,
} from '@common/admin/channels/channel-editor/channel-content-search-field';
import {ChannelContentItemImage} from '@app/admin/channels/channel-content-item-image';
import {useSettings} from '@ui/settings/use-settings';
import {AppChannelAutoUpdateField} from '@app/admin/channels/app-channel-auto-update-field';
import {AppChannelRestrictionField} from '@app/admin/channels/app-channel-restriction-field';
import {Accordion, AccordionItem} from '@ui/accordion/accordion';

export function EditChannelPage() {
  const {spotify_is_setup, lastfm_is_setup} = useSettings();
  return (
    <EditChannelPageLayout>
      <Fragment>
        <Accordion variant="outline">
          <AccordionItem
            label={<Trans message="Title & description" />}
            startIcon={<DescriptionIcon />}
          >
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
              rows={1}
              className="mt-24"
            />
            <FormTextField
              name="config.adminDescription"
              label={
                <Fragment>
                  <Trans message="Internal description" />
                  <InfoDialogTrigger
                    body={
                      <Trans message="This describes the purpose of the channel and is only visible in admin area." />
                    }
                  />
                </Fragment>
              }
              inputElementType="textarea"
              rows={1}
              className="mt-24"
            />
          </AccordionItem>
          <AccordionItem
            label={<Trans message="Content settings" />}
            startIcon={<SettingsIcon />}
          >
            <ContentTypeField config={channelContentConfig} className="mb-24" />
            <AppChannelAutoUpdateField
              config={channelContentConfig}
              className="mb-24"
            />
            <ContentModelField
              config={channelContentConfig}
              className="mb-24"
            />
            <AppChannelRestrictionField
              config={channelContentConfig}
              className="mb-24"
            />
            <ContentOrderField
              config={channelContentConfig}
              className="mb-24"
            />
          </AccordionItem>
          <AccordionItem
            label={<Trans message="Layout" />}
            startIcon={<DashboardIcon />}
          >
            <ContentLayoutFields
              config={channelContentConfig}
              className="mb-24"
            />
            <ChannelPaginationTypeField config={channelContentConfig} />
          </AccordionItem>
          <AccordionItem
            label={<Trans message="SEO" />}
            startIcon={<PublicIcon />}
          >
            <ChannelSeoFields />
          </AccordionItem>
        </Accordion>
        <ChannelContentEditor searchField={<SearchField />} />
      </Fragment>
    </EditChannelPageLayout>
  );
}

function SearchField(props: ChannelContentSearchFieldProps) {
  return (
    <ChannelContentSearchField
      {...props}
      imgRenderer={item => <ChannelContentItemImage item={item} />}
    />
  );
}
