import {useForm, useFormContext} from 'react-hook-form';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {FormFileField} from '@ui/forms/input-field/file-field';
import {Trans} from '@ui/i18n/trans';
import React, {Fragment} from 'react';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';
import {AdminSettings} from '@common/admin/settings/admin-settings';

export function ReportsSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Analytics" />}
      description={
        <Trans message="Configure google analytics integration and credentials." />
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
      files: {
        certificate: '',
      },
      server: {
        analytics_property_id: data.server.analytics_property_id ?? '',
      },
      client: {
        analytics: {
          tracking_code: data.client.analytics?.tracking_code ?? '',
          gchart_api_key: data.client.analytics?.gchart_api_key ?? '',
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <AnalyticsSection />
    </AdminSettingsForm>
  );
}

function AnalyticsSection() {
  const {clearErrors} = useFormContext();
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="analytics_group"
    >
      {isInvalid => (
        <Fragment>
          <FormFileField
            className="mb-30"
            onChange={() => clearErrors()}
            invalid={isInvalid}
            name="files.certificate"
            accept=".json"
            label={<Trans message="Google service account key file (.json)" />}
          />
          <FormTextField
            className="mb-30"
            onChange={() => clearErrors()}
            invalid={isInvalid}
            name="server.analytics_property_id"
            type="number"
            label={<Trans message="Google analytics property ID" />}
          />
          <FormTextField
            className="mb-30"
            onChange={() => clearErrors()}
            invalid={isInvalid}
            name="client.analytics.tracking_code"
            placeholder="G-******"
            min="1"
            max="20"
            description={
              <Trans message="Google analytics measurement ID only, not the whole javascript snippet." />
            }
            label={<Trans message="Google tag manager measurement ID" />}
          />
          <FormTextField
            name="client.analytics.gchart_api_key"
            label={<Trans message="Google maps javascript API key" />}
            description={
              <Trans message="Only required in order to show world geochart on integrated analytics pages." />
            }
          />
        </Fragment>
      )}
    </SettingsErrorGroup>
  );
}
