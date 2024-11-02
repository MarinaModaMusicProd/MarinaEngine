import {useAdminSettings} from '../requests/use-admin-settings';
import {TextField} from '@ui/forms/input-field/text-field/text-field';
import {FormSelect, Option} from '@ui/forms/select/select';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {Button} from '@ui/buttons/button';
import {ExternalLink} from '@ui/buttons/external-link';
import {Trans} from '@ui/i18n/trans';
import React, {Fragment, useContext} from 'react';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {useSettings} from '@ui/settings/use-settings';
import {useValueLists} from '@common/http/value-lists';
import {useForm, useFormContext} from 'react-hook-form';
import {AdminSettingsWithFiles} from '@common/admin/settings/requests/use-update-admin-settings';
import {useGenerateSitemap} from '@common/admin/settings/requests/use-generate-sitemap';
import {useBootstrapDataStore} from '@ui/bootstrap-data/bootstrap-data-store';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {SettingsSeparator} from '@common/admin/settings/form/settings-separator';
import {LearnMoreLink} from '@common/admin/settings/form/learn-more-link';

export function GeneralSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="General" />}
      description={
        <Trans message="Configure site url, homepage, theme and other general settings." />
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
        homepage: {
          type: data.client.homepage?.type ?? 'landingPage',
          value: data.client.homepage?.value ?? '',
        },
        themes: {
          default_id: data.client.themes?.default_id
            ? parseInt(data.client.themes.default_id as string)
            : 0,
          user_change: data.client.themes?.user_change ?? false,
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <SiteUrlSection />
      <SettingsSeparator />
      <HomepageSection />
      <SettingsSeparator />
      <ThemeSection />
      <SettingsSeparator />
      <SitemapSection />
    </AdminSettingsForm>
  );
}

function SiteUrlSection() {
  const {data} = useAdminSettings();

  if (!data) return null;

  let append = null;
  const server = data!.server;
  const isInvalid = server.newAppUrl && server.newAppUrl !== server.app_url;
  if (isInvalid) {
    append = (
      <div className="mt-20 text-sm text-danger">
        <Trans
          values={{
            baseUrl: server.app_url,
            currentUrl: server.newAppUrl,
            b: chunks => <b>{chunks}</b>,
          }}
          message="Base site url is set as <b>:baseUrl</b> in configuration, but current url is <b>:currentUrl</b>. It is recommended to set the primary url you want to use in configuration file and then redirect all other url versions to this primary version via cpanel or .htaccess file."
        />
      </div>
    );
  }

  return (
    <Fragment>
      <TextField
        readOnly
        invalid={!!isInvalid}
        value={server.app_url}
        label={<Trans message="Primary site url" />}
        description={
          <LearnMoreLink link="https://support.MarinaModa.com/hc/articles/35/primary-site-url" />
        }
      />
      {append}
    </Fragment>
  );
}

function HomepageSection() {
  const {watch} = useFormContext<AdminSettingsWithFiles>();
  const {homepage} = useContext(SiteConfigContext);
  const {data} = useValueLists(['menuItemCategories']);
  const selectedType = watch('client.homepage.type');

  return (
    <div>
      <FormSelect
        name="client.homepage.type"
        selectionMode="single"
        label={<Trans message="Site home page" />}
        description={
          <Trans message="Which page should be used as site homepage." />
        }
      >
        {homepage.options.map(option => (
          <Option key={option.value} value={option.value}>
            <Trans {...option.label} />
          </Option>
        ))}
        {data?.menuItemCategories?.map(category => (
          <Option key={category.type} value={category.type}>
            {category.name}
          </Option>
        ))}
      </FormSelect>
      {data?.menuItemCategories?.map(category => {
        return selectedType === category.type ? (
          <FormSelect
            className="mt-24"
            name="client.homepage.value"
            key={category.name}
            selectionMode="single"
            label={
              <Trans message="Homepage :name" values={{name: category.name}} />
            }
          >
            {category.items.map(item => (
              <Option key={item.label} value={`${item.model_id}`}>
                {item.label}
              </Option>
            ))}
          </FormSelect>
        ) : null;
      })}
    </div>
  );
}

function ThemeSection() {
  const themes = useBootstrapDataStore(s => s.data.themes);
  return (
    <Fragment>
      <FormSelect
        className="mb-20"
        name="client.themes.default_id"
        selectionMode="single"
        label={<Trans message="Default site theme" />}
        description={
          <Trans message="Which theme to use for users that have not chosen a theme manually." />
        }
      >
        <Option value={0}>
          <Trans message="System" />
        </Option>
        {themes.map(theme => (
          <Option key={theme.id} value={theme.id}>
            {theme.name}
          </Option>
        ))}
      </FormSelect>
      <FormSwitch
        name="client.themes.user_change"
        description={
          <Trans message="Allow users to manually change site theme." />
        }
      >
        <Trans message="Allow theme change" />
      </FormSwitch>
    </Fragment>
  );
}

function SitemapSection() {
  const generateSitemap = useGenerateSitemap();
  const {base_url} = useSettings();

  const url = `${base_url}/storage/sitemaps/sitemap-index.xml`;
  const link = <ExternalLink href={url}>{url}</ExternalLink>;

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        color="primary"
        disabled={generateSitemap.isPending}
        onClick={() => {
          generateSitemap.mutate();
        }}
      >
        <Trans message="Generate sitemap" />
      </Button>
      <div className="mt-14 text-sm text-muted">
        <Trans
          message="Once generated, sitemap url will be: :url"
          values={{
            url: link,
          }}
        />
      </div>
    </>
  );
}
