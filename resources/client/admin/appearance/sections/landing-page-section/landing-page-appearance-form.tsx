import {useAppearanceEditorValues} from '@common/admin/appearance/requests/use-appearance-editor-values';
import {useForm} from 'react-hook-form';
import {AppearanceEditorForm} from '@common/admin/appearance/appearance-editor-form';
import {Outlet, useLocation} from 'react-router-dom';
import {AppearanceEditorBreadcrumb} from '@common/admin/appearance/appearance-editor-breadcrumb';
import {Trans} from '@ui/i18n/trans';
import {LandingPageContent} from '@app/landing-page/landing-page-content';

interface FormValue {
  settings: {
    homepage: {
      appearance: LandingPageContent;
      trending: boolean;
      pricing: boolean;
    };
  };
}

export function LandingPageAppearanceForm() {
  const values = useAppearanceEditorValues();
  const form = useForm<FormValue>({
    defaultValues: {
      settings: {
        homepage: {
          appearance: {
            headerTitle: values.settings.homepage?.appearance.headerTitle ?? '',
            headerSubtitle:
              values.settings.homepage?.appearance.headerSubtitle ?? '',
            headerImage: values.settings.homepage?.appearance.headerImage ?? '',
            headerImageOpacity:
              values.settings.homepage?.appearance.headerImageOpacity ?? 0,
            headerOverlayColor1:
              values.settings.homepage?.appearance.headerOverlayColor1 ?? '',
            headerOverlayColor2:
              values.settings.homepage?.appearance.headerOverlayColor2 ?? '',
            footerTitle: values.settings.homepage?.appearance.footerTitle ?? '',
            footerSubtitle:
              values.settings.homepage?.appearance.footerSubtitle ?? '',
            footerImage: values.settings.homepage?.appearance.footerImage ?? '',
            primaryFeatures:
              values.settings.homepage?.appearance.primaryFeatures ?? [],
            secondaryFeatures:
              values.settings.homepage?.appearance.secondaryFeatures ?? [],
            actions: values.settings.homepage?.appearance.actions ?? {},
            pricingTitle:
              values.settings.homepage?.appearance.pricingTitle ?? '',
            pricingSubtitle:
              values.settings.homepage?.appearance.pricingSubtitle ?? '',
          },
          trending: values.settings.homepage?.trending ?? false,
          pricing: values.settings.homepage?.pricing ?? false,
        },
      },
    },
  });

  return (
    <AppearanceEditorForm
      form={form}
      breadcrumb={<Breadcrumb />}
      blockerAllowedPath="landing-page"
    >
      <Outlet />
    </AppearanceEditorForm>
  );
}

function Breadcrumb() {
  const {pathname} = useLocation();
  const lastSegment = pathname.split('/').pop();

  return (
    <AppearanceEditorBreadcrumb>
      <Trans message="Landing page" />
      {lastSegment === 'action-buttons' && <Trans message="Action buttons" />}
      {lastSegment === 'primary-features' && (
        <Trans message="Primary features" />
      )}
      {lastSegment === 'secondary-features' && (
        <Trans message="Secondary features" />
      )}
    </AppearanceEditorBreadcrumb>
  );
}
