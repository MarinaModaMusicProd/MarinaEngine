import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {ExternalLink} from '@ui/buttons/external-link';
import {SectionHelper} from '@common/ui/other/section-helper';
import {Trans} from '@ui/i18n/trans';
import {OutgoingMailGroup} from './outgoing-mail-group';
import {useSettings} from '@ui/settings/use-settings';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {SettingsSeparator} from '@common/admin/settings/form/settings-separator';
import React from 'react';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {useForm} from 'react-hook-form';

export function OutgoingEmailSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Outgoing email settings" />}
      description={
        <Trans message="Change outgoing email handlers, email credentials and other related settings." />
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
        mail_from_address: data.server.mail_from_address ?? '',
        mail_from_name: data.server.mail_from_name ?? '',
        mail_driver: data.server.mail_driver ?? '',
        mailgun_domain: data.server.mailgun_domain ?? '',
        mailgun_secret: data.server.mailgun_secret ?? '',
        mailgun_endpoint: data.server.mailgun_endpoint ?? '',
        mail_host: data.server.mail_host ?? '',
        mail_username: data.server.mail_username ?? '',
        mail_password: data.server.mail_password ?? '',
        mail_port: data.server.mail_port ?? '',
        mail_encryption: data.server.mail_encryption ?? '',
        ses_key: data.server.ses_key ?? '',
        ses_secret: data.server.ses_secret ?? '',
        ses_region: data.server.ses_region ?? '',
        postmark_token: data.server.postmark_token ?? '',
        connectedGmailAccount: data.server.connectedGmailAccount ?? '',
      },
      client: {
        mail: {
          contact_page_address: data.client.mail?.contact_page_address ?? '',
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <FormTextField
        id="outgoing-emails"
        className="mb-30"
        type="email"
        name="server.mail_from_address"
        label={<Trans message="From address" />}
        description={
          <Trans message="All outgoing application emails will be sent from this email address." />
        }
        required
      />
      <ContactAddressSection />
      <FormTextField
        className="mb-30"
        name="server.mail_from_name"
        label={<Trans message="From name" />}
        description={
          <Trans message="All outgoing application emails will be sent using this name." />
        }
        required
      />
      <SectionHelper
        color="warning"
        description={
          <Trans message="Your selected mail method must be authorized to send emails using this address and name." />
        }
      />
      <SettingsSeparator />
      <OutgoingMailGroup />
    </AdminSettingsForm>
  );
}

function ContactAddressSection() {
  const {base_url} = useSettings();
  const contactPageUrl = `${base_url}/contact`;
  const link = (
    <ExternalLink href={contactPageUrl}>{contactPageUrl}</ExternalLink>
  );
  return (
    <FormTextField
      className="mb-30"
      type="email"
      name="client.mail.contact_page_address"
      label={<Trans message="Contact page address" />}
      description={
        <Trans
          values={{
            contactPageUrl: link,
          }}
          message="Where emails from :contactPageUrl page should be sent to."
        />
      }
    />
  );
}
