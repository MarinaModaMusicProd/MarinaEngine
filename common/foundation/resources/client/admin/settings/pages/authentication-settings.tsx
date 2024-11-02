import {useForm, useFormContext} from 'react-hook-form';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';
import {Trans} from '@ui/i18n/trans';
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useSettings} from '@ui/settings/use-settings';
import {Button} from '@ui/buttons/button';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {SettingsSeparator} from '@common/admin/settings/form/settings-separator';

export function AuthenticationSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Authentication" />}
      description={
        <Trans message="Configure registration, social login and related 3rd party integrations." />
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
  const form = useForm<AdminSettings>({
    defaultValues: {
      client: {
        require_email_confirmation:
          data.client?.require_email_confirmation ?? false,
        registration: {
          disable: data.client.registration?.disable ?? false,
        },
        social: {
          requireAccount: data.client.social?.requireAccount ?? false,
          compact_buttons: data.client.social?.compact_buttons ?? false,
          envato: {
            enable: data.client.social?.envato?.enable ?? false,
          },
          google: {
            enable: data.client.social?.google?.enable ?? false,
          },
          facebook: {
            enable: data.client.social?.facebook?.enable ?? false,
          },
          twitter: {
            enable: data.client.social?.twitter?.enable ?? false,
          },
        },
        single_device_login: data.client.single_device_login ?? false,
        auth: {
          domain_blacklist: data.client.auth?.domain_blacklist ?? '',
        },
      },
      server: {
        envato_id: data.server?.envato_id ?? '',
        envato_secret: data.server?.envato_secret ?? '',
        envato_personal_token: data.server?.envato_personal_token ?? '',
        google_id: data.server?.google_id ?? '',
        google_secret: data.server?.google_secret ?? '',
        facebook_id: data.server?.facebook_id ?? '',
        facebook_secret: data.server?.facebook_secret ?? '',
        twitter_id: data.server?.twitter_id ?? '',
        twitter_secret: data.server?.twitter_secret ?? '',
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <EmailConfirmationSection />
      <FormSwitch
        className="mb-24"
        name="client.registration.disable"
        description={
          <Trans message="All registration related functionality will be disabled and hidden from users." />
        }
      >
        <Trans message="Disable registration" />
      </FormSwitch>
      <FormSwitch
        className="mb-24"
        name="client.social.requireAccount"
        description={
          <Trans message="If enabled, user will only be able to login via particular social site, if they have connected it from their account settings page." />
        }
      >
        <Trans message="Social login requires existing account" />
      </FormSwitch>
      <FormSwitch
        className="mb-24"
        name="client.single_device_login"
        description={
          <Trans message="Only allow one device to be logged into user account at the same time." />
        }
      >
        <Trans message="Single device login" />
      </FormSwitch>
      <FormSwitch
        name="client.social.compact_buttons"
        description={
          <Trans message="Use compact design for social login buttons." />
        }
      >
        <Trans message="Compact buttons" />
      </FormSwitch>
      <EnvatoSection />
      <GoogleSection />
      <FacebookSection />
      <TwitterSection />
      <SettingsSeparator />
      <FormTextField
        inputElementType="textarea"
        rows={3}
        className="mt-24"
        name="client.auth.domain_blacklist"
        label={<Trans message="Domain blacklist" />}
        description={
          <Trans message="Comma separated list of domains. Users will not be able to register or login using any email adress from specified domains." />
        }
      />
    </AdminSettingsForm>
  );
}

export function MailNotSetupWarning() {
  const {watch} = useFormContext<AdminSettings>();
  const mailSetup = watch('server.mail_setup');
  if (mailSetup) return null;

  return (
    <p className="mt-10 rounded-panel border p-10 text-sm text-danger">
      <Trans
        message="Outgoing mail method needs to be setup before enabling this setting. <a>Fix now</a>"
        values={{
          a: text => (
            <Button
              elementType={Link}
              variant="outline"
              size="xs"
              display="flex"
              className="mt-10 max-w-max"
              to="/admin/settings/outgoing-email"
            >
              {text}
            </Button>
          ),
        }}
      />
    </p>
  );
}

function EmailConfirmationSection() {
  return (
    <FormSwitch
      className="mb-30"
      name="client.require_email_confirmation"
      description={
        <Fragment>
          <Trans message="Require newly registered users to validate their email address before being able to login." />
          <MailNotSetupWarning />
        </Fragment>
      }
    >
      <Trans message="Require email confirmation" />
    </FormSwitch>
  );
}

function EnvatoSection() {
  const {watch} = useFormContext<AdminSettings>();
  const settings = useSettings();
  const envatoLoginEnabled = watch('client.social.envato.enable');

  if (!(settings as any).envato?.enable) return null;

  return (
    <SettingsErrorGroup separatorBottom={false} name="envato_group">
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.envato.enable"
            description={
              <Trans message="Enable logging into the site via envato." />
            }
          >
            <Trans message="Envato login" />
          </FormSwitch>
          {!!envatoLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.envato_id"
                label={<Trans message="Envato ID" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.envato_secret"
                label={<Trans message="Envato secret" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.envato_personal_token"
                label={<Trans message="Envato personal token" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}

function GoogleSection() {
  const {watch} = useFormContext<AdminSettings>();
  const googleLoginEnabled = watch('client.social.google.enable');

  return (
    <SettingsErrorGroup name="google_group">
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.google.enable"
            description={
              <Trans message="Enable logging into the site via google." />
            }
          >
            <Trans message="Google login" />
          </FormSwitch>
          {!!googleLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.google_id"
                label={<Trans message="Google client ID" />}
                required
              />
              <FormTextField
                className="mt-30"
                name="server.google_secret"
                label={<Trans message="Google client secret" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}

function FacebookSection() {
  const {watch} = useFormContext<AdminSettings>();
  const facebookLoginEnabled = watch('client.social.facebook.enable');

  return (
    <SettingsErrorGroup name="facebook_group" separatorTop={false}>
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.facebook.enable"
            description={
              <Trans message="Enable logging into the site via facebook." />
            }
          >
            <Trans message="Facebook login" />
          </FormSwitch>
          {!!facebookLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.facebook_id"
                label={<Trans message="Facebook app ID" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.facebook_secret"
                label={<Trans message="Facebook app secret" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}

function TwitterSection() {
  const {watch} = useFormContext<AdminSettings>();
  const twitterLoginEnabled = watch('client.social.twitter.enable');

  return (
    <SettingsErrorGroup
      name="twitter_group"
      separatorTop={false}
      separatorBottom={false}
    >
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.twitter.enable"
            description={
              <Trans message="Enable logging into the site via twitter." />
            }
          >
            <Trans message="Twitter login" />
          </FormSwitch>
          {!!twitterLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.twitter_id"
                label={<Trans message="Twitter ID" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.twitter_secret"
                label={<Trans message="Twitter secret" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}
