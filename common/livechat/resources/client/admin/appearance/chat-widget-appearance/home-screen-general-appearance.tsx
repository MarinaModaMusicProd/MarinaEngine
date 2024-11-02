import {
  AppearanceEditorValues,
  appearanceState,
} from '@common/admin/appearance/appearance-store';
import {FormImageSelector} from '@common/uploads/components/image-selector';
import {Trans} from '@ui/i18n/trans';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {BackgroundSelector} from '@common/background-selector/background-selector';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {Link} from 'react-router-dom';
import {useFormContext, useWatch} from 'react-hook-form';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {InfoIcon} from '@ui/icons/material/Info';
import {LinkStyle} from '@ui/buttons/external-link';
import {AppearanceSectionTitle} from '@common/admin/appearance/appearance-section-title';
import {Fragment} from 'react';
import {removeEmptyValuesFromObject} from '@ui/utils/objects/remove-empty-values-from-object';
import {type ChatWidgetAppearanceFormValue} from '@livechat/admin/appearance/chat-widget-appearance/chat-widget-appearance-form';

export function HomeScreenGeneralAppearance() {
  const form = useFormContext<ChatWidgetAppearanceFormValue>();
  const showHcCard = useWatch({
    control: form.control,
    name: 'settings.chatWidget.showHcCard',
  });
  return (
    <Fragment>
      <AppearanceSectionTitle marginTop="mt-0">
        <Trans message="Style" />
      </AppearanceSectionTitle>
      <FormImageSelector
        name={`settings.chatWidget.logo`}
        label={<Trans message="Logo" />}
        diskPrefix="widget_media"
        showRemoveButton
        className="mb-24"
        onChange={() => {
          appearanceState().preview.setHighlight('[data-logo="widget"]');
        }}
      />
      <FormSwitch
        className="mb-20"
        name="settings.chatWidget.showAvatars"
        description={
          <Trans message="Whether active agent avatars should be visible." />
        }
      >
        <Trans message="Show avatars" />
      </FormSwitch>
      <AppearanceButton to="background" elementType={Link}>
        <Trans message="Background" />
      </AppearanceButton>
      <AppearanceSectionTitle>
        <Trans message="Content" />
      </AppearanceSectionTitle>
      <AppearanceButton to="messages" elementType={Link}>
        <Trans message="Messages" />
      </AppearanceButton>
      <AppearanceButton to="links" elementType={Link}>
        <Trans message="Links" />
      </AppearanceButton>
      <FormSwitch className="mt-14" name="settings.chatWidget.showHcCard">
        <Trans message="Show help center card" />
      </FormSwitch>
      {showHcCard && (
        <FormSwitch
          className="mt-14"
          name="settings.chatWidget.hideHomeArticles"
        >
          <Trans message="Show suggested articles" />
        </FormSwitch>
      )}
    </Fragment>
  );
}

export function HomeScreenBackgroundAppearance() {
  const {watch, setValue} = useFormContext<AppearanceEditorValues>();
  return (
    <BackgroundSelector
      diskPrefix="widget_media"
      tabColWidth="grid-cols-3"
      value={watch('settings.chatWidget.background')}
      onChange={value => {
        // remove undefined values so isDirty on hook form works correctly
        const finalValue = removeEmptyValuesFromObject(value);
        // @ts-ignore
        delete finalValue.label;
        setValue('settings.chatWidget.background', finalValue, {
          shouldDirty: true,
        });
      }}
      underTabs={
        <FormSwitch name="settings.chatWidget.fadeBg" className="mb-20">
          <Trans message="Fade background" />
        </FormSwitch>
      }
    />
  );
}

export function HomeScreenMessagesConfig() {
  return (
    <div className="flex h-full flex-col">
      <FormTextField
        name="settings.chatWidget.greeting"
        label={<Trans message="Greeting" />}
        className="mb-16"
        description={
          <Trans message="Greeting for when user name is available." />
        }
      />
      <FormTextField
        name="settings.chatWidget.greetingAnonymous"
        label={<Trans message="Anonymous greeting" />}
        className="mb-16"
        description={
          <Trans message="Greeting for when user name is not available." />
        }
      />
      <FormTextField
        name="settings.chatWidget.introduction"
        label={<Trans message="Introduction" />}
        className="mb-16"
      />
      <FormTextField
        name="settings.chatWidget.homeNewChatTitle"
        label={<Trans message="New chat title" />}
        className="mb-16"
      />
      <FormTextField
        name="settings.chatWidget.homeNewChatSubtitle"
        label={<Trans message="New chat description" />}
      />
      <div className="mt-auto text-sm text-muted">
        <InfoIcon size="xs" className="mr-4" />
        <Trans
          message="You can translate these messages from <a>localizations page.</a>"
          values={{
            a: text => (
              <Link
                className={LinkStyle}
                to="/admin/localizations"
                target="_blank"
              >
                {text}
              </Link>
            ),
          }}
        />
      </div>
    </div>
  );
}
