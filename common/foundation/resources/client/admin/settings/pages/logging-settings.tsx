import {useForm, useFormContext} from 'react-hook-form';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {SectionHelper} from '@common/ui/other/section-helper';
import {ExternalLink} from '@ui/buttons/external-link';
import {Trans} from '@ui/i18n/trans';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import React from 'react';
import {AdminSettings} from '@common/admin/settings/admin-settings';

export function LoggingSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Error logging" />}
      description={
        <Trans message="Configure site error logging and related 3rd party integrations." />
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
      server: {
        sentry_dsn: data.server.sentry_dsn ?? '',
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <SentrySection />
      <SectionHelper
        className="mt-30"
        color="positive"
        description={
          <Trans
            values={{
              a: parts => (
                <ExternalLink href="https://sentry.io">{parts}</ExternalLink>
              ),
            }}
            message="<a>Sentry</a> integration provides real-time error tracking and helps identify and fix issues when site is in production."
          />
        }
      />
    </AdminSettingsForm>
  );
}

function SentrySection() {
  const {clearErrors} = useFormContext();
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="logging_group"
    >
      {isInvalid => {
        return (
          <FormTextField
            onChange={() => clearErrors()}
            invalid={isInvalid}
            name="server.sentry_dsn"
            type="url"
            minLength={30}
            label={<Trans message="Sentry DSN" />}
          />
        );
      }}
    </SettingsErrorGroup>
  );
}
