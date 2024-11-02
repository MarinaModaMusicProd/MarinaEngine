import {useForm, useFormContext} from 'react-hook-form';
import React, {Fragment, useContext} from 'react';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {Trans} from '@ui/i18n/trans';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';
import {AdminSettings} from '@common/admin/settings/admin-settings';

export function RecaptchaSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Recaptcha" />}
      description={
        <Trans message="Configure google recaptcha integration and credentials." />
      }
    >
      {data => <Form data={data} />}
    </AdminSettingsLayout>
  );
}

interface FormProps {
  data: AdminSettings;
}
function Form({data}: FormProps) {
  const {settings} = useContext(SiteConfigContext);
  const form = useForm<AdminSettings>({
    defaultValues: {
      client: {
        recaptcha: {
          enable: {
            link_creation:
              data.client.recaptcha?.enable?.link_creation ?? false,
            contact: data.client.recaptcha?.enable?.contact ?? false,
            register: data.client.recaptcha?.enable?.register ?? false,
          },
          site_key: data.client.recaptcha?.site_key ?? '',
          secret_key: data.client.recaptcha?.secret_key ?? '',
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      {settings?.showRecaptchaLinkSwitch && (
        <FormSwitch
          className="mb-30"
          name="client.recaptcha.enable.link_creation"
          description={
            <Trans message="Enable recaptcha integration when creating links from homepage or user dashboard." />
          }
        >
          <Trans message="Link creation" />
        </FormSwitch>
      )}
      <FormSwitch
        className="mb-30"
        name="client.recaptcha.enable.contact"
        description={
          <Trans
            message={'Enable recaptcha integration for "contact us" page.'}
          />
        }
      >
        <Trans message="Contact page" />
      </FormSwitch>
      <FormSwitch
        className="mb-30"
        name="client.recaptcha.enable.register"
        description={
          <Trans message="Enable recaptcha integration for registration page." />
        }
      >
        <Trans message="Registration page" />
      </FormSwitch>
      <RecaptchaSection />
    </AdminSettingsForm>
  );
}

function RecaptchaSection() {
  const {clearErrors} = useFormContext();
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="recaptcha_group"
    >
      {isInvalid => {
        return (
          <>
            <FormTextField
              className="mb-30"
              onChange={() => {
                clearErrors();
              }}
              invalid={isInvalid}
              name="client.recaptcha.site_key"
              label={<Trans message="Recaptcha v3 site key" />}
            />
            <FormTextField
              onChange={() => {
                clearErrors();
              }}
              invalid={isInvalid}
              name="client.recaptcha.secret_key"
              label={<Trans message="Recaptcha v3 secret key" />}
            />
          </>
        );
      }}
    </SettingsErrorGroup>
  );
}
