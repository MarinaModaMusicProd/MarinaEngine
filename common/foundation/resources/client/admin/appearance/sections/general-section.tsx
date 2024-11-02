import {appearanceState, useAppearanceStore} from '../appearance-store';
import {FormImageSelector} from '@common/uploads/components/image-selector';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {ReactNode} from 'react';
import {Settings} from '@ui/settings/settings';
import {useForm} from 'react-hook-form';
import {useAppearanceEditorValues} from '@common/admin/appearance/requests/use-appearance-editor-values';
import {AppearanceEditorForm} from '@common/admin/appearance/appearance-editor-form';
import {AppearanceEditorBreadcrumb} from '@common/admin/appearance/appearance-editor-breadcrumb';

interface Payload {
  settings: {
    branding: {
      favicon: string;
      logo_light: string;
      logo_dark: string;
      logo_light_mobile: string;
      logo_dark_mobile: string;
      site_description: string;
    };
  };
  appearance: {
    env: {
      app_name: string;
    };
  };
}

export function GeneralSection() {
  const values = useAppearanceEditorValues();
  const form = useForm<Payload>({
    defaultValues: {
      settings: {
        branding: {
          favicon: values.settings.branding.favicon,
          logo_light: values.settings.branding.logo_light,
          logo_dark: values.settings.branding.logo_dark,
          logo_light_mobile: values.settings.branding.logo_light_mobile,
          logo_dark_mobile: values.settings.branding.logo_dark_mobile,
          site_description: values.settings.branding.site_description,
        },
      },
      appearance: {
        env: {
          app_name: values.appearance.env.app_name,
        },
      },
    },
  });
  return (
    <AppearanceEditorForm
      form={form}
      breadcrumb={
        <AppearanceEditorBreadcrumb>
          <Trans message="General" />
        </AppearanceEditorBreadcrumb>
      }
    >
      <BrandingImageSelector
        label={<Trans message="Favicon" />}
        description={
          <Trans message="This will generate different size favicons. Image should be at least 512x512 in size." />
        }
        type="favicon"
      />
      <BrandingImageSelector
        label={<Trans message="Light logo" />}
        description={<Trans message="Will be used on dark backgrounds." />}
        type="logo_light"
      />
      <BrandingImageSelector
        label={<Trans message="Dark logo" />}
        description={
          <Trans message="Will be used on light backgrounds. Will default to light logo if left empty." />
        }
        type="logo_dark"
      />
      <BrandingImageSelector
        label={<Trans message="Mobile light logo" />}
        description={
          <Trans message="Will be used on light backgrounds on mobile. Will default to desktop logo if left empty." />
        }
        type="logo_light_mobile"
      />
      <BrandingImageSelector
        label={<Trans message="Mobile dark logo" />}
        description={
          <Trans message="Will be used on dark backgrounds on mobile. Will default to desktop if left empty." />
        }
        type="logo_dark_mobile"
      />
      <SiteNameTextField />
      <SiteDescriptionTextArea />
    </AppearanceEditorForm>
  );
}

interface ImageSelectorProps {
  label: ReactNode;
  description: ReactNode;
  type: keyof Settings['branding'];
}
function BrandingImageSelector({label, description, type}: ImageSelectorProps) {
  const defaultValue = useAppearanceStore(
    s => s.defaults?.settings.branding[type],
  );
  return (
    <FormImageSelector
      name={`settings.branding.${type}`}
      className="mb-30 border-b pb-30"
      label={label}
      description={description}
      diskPrefix="branding_media"
      defaultValue={defaultValue}
      onChange={() => {
        appearanceState().preview.setHighlight('[data-logo="navbar"]');
      }}
    />
  );
}
function SiteNameTextField() {
  return (
    <FormTextField
      name="appearance.env.app_name"
      required
      className="mt-20"
      label={<Trans message="Site name" />}
    />
  );
}

function SiteDescriptionTextArea() {
  return (
    <FormTextField
      name="settings.branding.site_description"
      className="mt-20"
      inputElementType="textarea"
      rows={4}
      label={<Trans message="Site description" />}
    />
  );
}
