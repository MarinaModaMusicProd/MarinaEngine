import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {useTrans} from '@ui/i18n/use-trans';
import {Trans} from '@ui/i18n/trans';
import {Tabs} from '@ui/tabs/tabs';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {TabPanel, TabPanels} from '@ui/tabs/tab-panels';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {useForm, useFormContext} from 'react-hook-form';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {LearnMoreLink} from '@common/admin/settings/form/learn-more-link';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';
import React, {Fragment} from 'react';
import {JsonChipField} from '@common/admin/settings/form/json-chip-field';
import {SettingsSeparator} from '@common/admin/settings/form/settings-separator';

export function SubscriptionSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Subscriptions" />}
      description={
        <Trans message="Configure gateway integration, accepted cards, invoices and other related settings." />
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
  const {trans} = useTrans();
  const form = useForm<AdminSettings>({
    defaultValues: {
      client: {
        billing: {
          enable: data.client.billing?.enable ?? false,
          accepted_cards: data.client.billing?.accepted_cards ?? [],
          paypal_test_mode: data.client.billing?.paypal_test_mode ?? false,
          paypal: {
            enable: data.client.billing?.paypal?.enable ?? false,
          },
          stripe: {
            enable: data.client.billing?.stripe?.enable ?? false,
          },
          invoice: {
            address: data.client.billing?.invoice?.address ?? '',
            notes: data.client.billing?.invoice?.notes ?? '',
          },
        },
      },
      server: {
        paypal_client_id: data.server?.paypal_client_id ?? '',
        paypal_secret: data.server?.paypal_secret ?? '',
        paypal_webhook_id: data.server?.paypal_webhook_id ?? '',
        stripe_key: data.server?.stripe_key ?? '',
        stripe_secret: data.server?.stripe_secret ?? '',
        stripe_webhook_secret: data.server?.stripe_webhook_secret ?? '',
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <Tabs>
        <TabList>
          <Tab>
            <Trans message="General" />
          </Tab>
          <Tab>
            <Trans message="Invoices" />
          </Tab>
        </TabList>
        <TabPanels className="pt-30">
          <TabPanel>
            <FormSwitch
              name="client.billing.enable"
              description={
                <Trans message="Enable or disable all subscription related functionality across the site." />
              }
            >
              <Trans message="Enable subscriptions" />
            </FormSwitch>
            <SettingsSeparator />
            <PaypalSection />
            <StripeSection />
            <SettingsSeparator />
            <JsonChipField
              label={<Trans message="Accepted cards" />}
              name="client.billing.accepted_cards"
              placeholder={trans({message: 'Add new card...'})}
            />
          </TabPanel>
          <TabPanel>
            <FormTextField
              inputElementType="textarea"
              rows={5}
              label={<Trans message="Invoice address" />}
              name="client.billing.invoice.address"
              className="mb-30"
            />
            <FormTextField
              inputElementType="textarea"
              rows={5}
              label={<Trans message="Invoice notes" />}
              description={
                <Trans message="Default notes to show under `notes` section of user invoice. Optional." />
              }
              name="client.billing.invoice.notes"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AdminSettingsForm>
  );
}

function PaypalSection() {
  const {watch} = useFormContext<AdminSettings>();
  const paypalIsEnabled = watch('client.billing.paypal.enable');
  return (
    <div className="mb-30">
      <FormSwitch
        name="client.billing.paypal.enable"
        description={
          <div>
            <Trans message="Enable PayPal payment gateway integration." />
            <LearnMoreLink
              className="mt-6"
              link="https://support.MarinaModa.com/hc/articles/147/configuring-paypal"
            />
          </div>
        }
      >
        <Trans message="PayPal gateway" />
      </FormSwitch>
      {paypalIsEnabled ? (
        <SettingsErrorGroup name="paypal_group">
          {isInvalid => (
            <Fragment>
              <FormTextField
                name="server.paypal_client_id"
                label={<Trans message="PayPal Client ID" />}
                required
                invalid={isInvalid}
                className="mb-20"
              />
              <FormTextField
                name="server.paypal_secret"
                label={<Trans message="PayPal Secret" />}
                required
                invalid={isInvalid}
                className="mb-20"
              />
              <FormTextField
                name="server.paypal_webhook_id"
                label={<Trans message="PayPal Webhook ID" />}
                required
                invalid={isInvalid}
                className="mb-20"
              />
              <FormSwitch
                name="client.billing.paypal_test_mode"
                invalid={isInvalid}
                description={
                  <div>
                    <Trans message="Allows testing PayPal payments with sandbox accounts." />
                  </div>
                }
              >
                <Trans message="PayPal test mode" />
              </FormSwitch>
            </Fragment>
          )}
        </SettingsErrorGroup>
      ) : null}
    </div>
  );
}

function StripeSection() {
  const {watch} = useFormContext<AdminSettings>();
  const stripeEnabled = watch('client.billing.stripe.enable');
  return (
    <Fragment>
      <FormSwitch
        name="client.billing.stripe.enable"
        description={
          <div>
            <Trans message="Enable Stripe payment gateway integration." />
            <LearnMoreLink
              className="mt-6"
              link="https://support.MarinaModa.com/hc/articles/148/configuring-stripe"
            />
          </div>
        }
      >
        <Trans message="Stripe gateway" />
      </FormSwitch>
      {stripeEnabled ? (
        <SettingsErrorGroup name="stripe_group" separatorBottom={false}>
          {isInvalid => (
            <Fragment>
              <FormTextField
                name="server.stripe_key"
                label={<Trans message="Stripe publishable key" />}
                required
                className="mb-20"
                invalid={isInvalid}
              />
              <FormTextField
                name="server.stripe_secret"
                label={<Trans message="Stripe secret key" />}
                required
                className="mb-20"
                invalid={isInvalid}
              />
              <FormTextField
                name="server.stripe_webhook_secret"
                label={<Trans message="Stripe webhook signing secret" />}
                className="mb-20"
                invalid={isInvalid}
              />
            </Fragment>
          )}
        </SettingsErrorGroup>
      ) : null}
    </Fragment>
  );
}
