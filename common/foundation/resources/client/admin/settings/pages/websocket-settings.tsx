import {useForm, useFormContext, useWatch} from 'react-hook-form';
import React, {ComponentType, Fragment} from 'react';
import {AdminSettings} from '../admin-settings';
import {FormSelect, Option} from '@ui/forms/select/select';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {LearnMoreLink} from '@common/admin/settings/form/learn-more-link';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';

export function WebsocketSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Websockets" />}
      description={
        <Fragment>
          <Trans message="Configure websockets provider responsible for all realtime functionality on the site." />
          <LearnMoreLink
            className="mt-6 text-sm"
            link="https://support.MarinaModa.com/hc/articles/224/queues"
          />
        </Fragment>
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
        broadcast_driver: data.server.broadcast_driver ?? 'null',

        // pusher
        pusher_app_id: data.server.pusher_app_id ?? '',
        pusher_app_key: data.server.pusher_app_key ?? '',
        pusher_app_secret: data.server.pusher_app_secret ?? '',
        pusher_app_cluster: data.server.pusher_app_cluster ?? '',

        // reverb
        reverb_app_id: data.server.reverb_app_id ?? '',
        reverb_app_key: data.server.reverb_app_key ?? '',
        reverb_app_secret: data.server.reverb_app_secret ?? '',
        reverb_host: data.server.reverb_host ?? '',
        reverb_port: data.server.reverb_port ?? '',
        reverb_scheme: data.server.reverb_scheme ?? 'https',

        // ably
        ably_app_id: data.server.ably_app_id ?? '',
        ably_app_key: data.server.ably_app_key ?? '',
        ably_app_secret: data.server.ably_app_secret ?? '',
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <DriverSection />
    </AdminSettingsForm>
  );
}

function DriverSection() {
  const {clearErrors, control} = useFormContext<AdminSettings>();
  const driver = useWatch({
    control,
    name: 'server.broadcast_driver',
  });

  let CredentialSection: ComponentType<CredentialsProps> | null = null;
  if (driver === 'pusher') {
    CredentialSection = PusherFields;
  } else if (driver === 'ably') {
    CredentialSection = AblyFields;
  }
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="queue_group"
    >
      {isInvalid => (
        <Fragment>
          <FormSelect
            invalid={isInvalid}
            onSelectionChange={() => clearErrors()}
            selectionMode="single"
            name="server.broadcast_driver"
            label={<Trans message="Websockets provider" />}
            required
          >
            <Option value="null">
              <Trans message="None (Disabled)" />
            </Option>
            <Option value="reverb">Local</Option>
            <Option value="pusher">Pusher</Option>
            <Option value="ably">
              <Trans message="Ably" />
            </Option>
          </FormSelect>
          {CredentialSection && (
            <div className="mt-30">
              <CredentialSection isInvalid={isInvalid} />
            </div>
          )}
        </Fragment>
      )}
    </SettingsErrorGroup>
  );
}

interface CredentialsProps {
  isInvalid: boolean;
}
function PusherFields({isInvalid}: CredentialsProps) {
  return (
    <Fragment>
      <FormTextField
        name="server.pusher_app_id"
        label={<Trans message="Pusher app ID" />}
        className="mb-30"
        required
      />
      <FormTextField
        name="server.pusher_app_key"
        label={<Trans message="Pusher app key" />}
        className="mb-30"
        required
      />
      <FormTextField
        name="server.pusher_app_secret"
        label={<Trans message="Pusher app secret" />}
        className="mb-30"
        required
      />
      <FormTextField
        name="server.pusher_app_cluster"
        label={<Trans message="Pusher app cluster" />}
        className="mb-30"
        placeholder="mt1"
        required
      />
    </Fragment>
  );
}

function AblyFields({isInvalid}: CredentialsProps) {
  return (
    <Fragment>
      <FormTextField
        name="server.ably_app_id"
        label={<Trans message="Ably app ID" />}
        className="mb-30"
        required
      />
      <FormTextField
        name="server.ably_app_key"
        label={<Trans message="Ably app key" />}
        className="mb-30"
        required
      />
      <FormTextField
        name="server.ably_app_secret"
        label={<Trans message="Ably app secret" />}
        className="mb-30"
        required
      />
    </Fragment>
  );
}
