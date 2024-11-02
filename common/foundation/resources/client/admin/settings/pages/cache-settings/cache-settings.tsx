import {useForm, useFormContext} from 'react-hook-form';
import React, {ComponentType, Fragment} from 'react';
import {FormSelect, Option} from '@ui/forms/select/select';
import {SettingsErrorGroup} from '@common/admin/settings/form/settings-error-group';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {useClearCache} from '@common/admin/settings/pages/cache-settings/clear-cache';
import {Button} from '@ui/buttons/button';
import {SectionHelper} from '@common/ui/other/section-helper';
import {Trans} from '@ui/i18n/trans';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';

export function CacheSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Cache settings" />}
      description={
        <Trans message="Select cache provider and manually clear cache." />
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
  const clearCache = useClearCache();
  const form = useForm<AdminSettings>({
    defaultValues: {
      server: {
        cache_driver: data.server.cache_driver ?? 'file',
        memcached_host: data.server.memcached_host ?? '',
        memcached_port: data.server.memcached_port ?? '',
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <CacheSelect />
      <Button
        type="button"
        variant="outline"
        size="xs"
        color="primary"
        disabled={clearCache.isPending}
        onClick={() => clearCache.mutate()}
      >
        <Trans message="Clear cache" />
      </Button>
      <SectionHelper
        color="warning"
        className="mt-30"
        description={
          <Trans
            message={
              '"File" is the best option for most cases and should not be changed, unless you are familiar with another cache method and have it set up on the server already.'
            }
          />
        }
      />
    </AdminSettingsForm>
  );
}

function CacheSelect() {
  const {watch, clearErrors} = useFormContext<AdminSettings>();
  const cacheDriver = watch('server.cache_driver');

  let CredentialSection: ComponentType<CredentialProps> | null = null;
  if (cacheDriver === 'memcached') {
    CredentialSection = MemcachedCredentials;
  }

  return (
    <SettingsErrorGroup separatorTop={false} name="cache_group">
      {isInvalid => {
        return (
          <>
            <FormSelect
              invalid={isInvalid}
              onSelectionChange={() => clearErrors()}
              selectionMode="single"
              name="server.cache_driver"
              label={<Trans message="Cache method" />}
              description={
                <Trans message="Which method should be used for storing and retrieving cached items." />
              }
            >
              <Option value="file">
                <Trans message="File (Default)" />
              </Option>
              <Option value="array">
                <Trans message="None" />
              </Option>
              <Option value="apc">APC</Option>
              <Option value="memcached">Memcached</Option>
              <Option value="redis">Redis</Option>
            </FormSelect>
            {CredentialSection && (
              <div className="mt-30">
                <CredentialSection isInvalid={isInvalid} />
              </div>
            )}
          </>
        );
      }}
    </SettingsErrorGroup>
  );
}

interface CredentialProps {
  isInvalid: boolean;
}
function MemcachedCredentials({isInvalid}: CredentialProps) {
  return (
    <>
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.memcached_host"
        label={<Trans message="Memcached host" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        type="number"
        name="server.memcached_port"
        label={<Trans message="Memcached port" />}
        required
      />
    </>
  );
}
