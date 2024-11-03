import React, {Fragment} from 'react';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Trans} from '@common/i18n/trans';
import {SlugEditor} from '@common/ui/slug-editor';
import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {FormSwitch} from '@common/ui/forms/toggle/switch';
import {ChannelContentTypeField} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-content-type-field';
import {ChannelLayoutField} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-layout-field';
import {ChannelContentOrderField} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-content-order-field';
import {ChannelAutoUpdateMethodField} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-auto-update-method-field';
import {ChannelContentModelField} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-content-model-field';
import {ChannelContentEditor} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-content-editor';
import {Tabs} from '@common/ui/tabs/tabs';
import {TabList} from '@common/ui/tabs/tab-list';
import {Tab} from '@common/ui/tabs/tab';
import {TabPanel, TabPanels} from '@common/ui/tabs/tab-panels';

interface CrupdateChannelFormProps {
  disableSlugEditing?: boolean;
}
export function CrupdateChannelForm({
  disableSlugEditing,
}: CrupdateChannelFormProps) {
  return (
    <Fragment>
      <Tabs isLazy>
        <TabList>
          <Tab>
            <Trans message="Details" />
          </Tab>
          <Tab>
            <Trans message="SEO" />
          </Tab>
        </TabList>
        <TabPanels className="pt-20">
          <TabPanel>
            <MainFields disableSlugEditing={disableSlugEditing} />
          </TabPanel>
          <TabPanel>
            <SeoFields />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ChannelContentEditor />
    </Fragment>
  );
}

interface MainFieldsProps {
  disableSlugEditing?: boolean;
}
function MainFields({disableSlugEditing}: MainFieldsProps) {
  return (
    <Fragment>
      <FormTextField
        name="name"
        label={<Trans message="Name" />}
        className="mb-10"
        required
        autoFocus
      />
      <FormSlugField disableEditing={disableSlugEditing} />
      <ChannelContentTypeField />
      <ChannelAutoUpdateMethodField />
      <ChannelContentModelField />
      <ChannelContentOrderField />
      <ChannelLayoutField />
      <FormSwitch
        className="mb-24"
        name="config.hideTitle"
        description={
          <Trans message="Whether title should be shown when displaying this channel on the site." />
        }
      >
        <Trans message="Hide title" />
      </FormSwitch>
      <FormSwitch
        name="config.carouselWhenNested"
        description={
          <Trans message="Show this channel content in carousel instead of a grid, when it's nested under another channel." />
        }
      >
        <Trans message="Switch to carousel" />
      </FormSwitch>
      <GenreSwitch />
    </Fragment>
  );
}
function GenreSwitch() {
  const {watch} = useFormContext<UpdateChannelPayload>();
  if (watch('config.contentType') === 'autoUpdate') {
    return null;
  }
  return (
    <FormSwitch
      className="mt-24"
      name="config.connectToGenreViaUrl"
      description={
        <Trans message="Filter this channel contents by genre specified in the url." />
      }
    >
      <Trans message="Filter by genre" />
    </FormSwitch>
  );
}

function SeoFields() {
  return (
    <Fragment>
      <FormTextField
        name="config.seoTitle"
        label={<Trans message="SEO title" />}
        className="mb-24"
      />
      <FormTextField
        name="config.seoDescription"
        label={<Trans message="SEO description" />}
        inputElementType="textarea"
        rows={6}
      />
    </Fragment>
  );
}

interface FormSlugFieldProps {
  disableEditing?: boolean;
}
function FormSlugField({disableEditing}: FormSlugFieldProps) {
  const {watch, setValue} = useFormContext<UpdateChannelPayload>();
  const value = watch('slug');
  const name = watch('name');
  return (
    <SlugEditor
      hideButton={disableEditing}
      placeholder={name}
      suffix={watch('config.connectToGenreViaUrl') ? 'GENRE_SLUG' : undefined}
      className="text-sm"
      pattern="[A-Za-z0-9_-]+"
      minLength={3}
      maxLength={20}
      value={value}
      onChange={newSlug => {
        setValue('slug', newSlug);
      }}
    />
  );
}
