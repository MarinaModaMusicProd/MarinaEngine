import {Navigate, Outlet, useLocation, useMatches} from 'react-router-dom';
import {useEffect, useRef} from 'react';
import {AppearanceEditorValues, appearanceState} from './appearance-store';
import {useAppearanceEditorValuesQuery} from './requests/use-appearance-editor-values';
import {Trans} from '@ui/i18n/trans';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {useAppearanceEditorMode} from './commands/use-appearance-editor-mode';
import {StaticPageTitle} from '../../seo/static-page-title';
import {useSettings} from '@ui/settings/use-settings';
import mergedAppearanceConfig from '@common/admin/appearance/config/merged-appearance-config';

function usePreviewRoute(): string {
  const {pathname} = useLocation();
  const matches = useMatches();
  const subRoute = (matches.at(-1)?.handle as any)?.previewRoute;
  const activeSection = pathname.split('/')[3];
  const config = mergedAppearanceConfig.sections[activeSection];

  const baseRoute =
    config?.previewRoute || mergedAppearanceConfig.preview.defaultRoute || '/';

  if (subRoute) {
    return `${baseRoute}/${subRoute}`;
  }

  return baseRoute;
}

export function AppearanceEditorPage() {
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {data} = useAppearanceEditorValuesQuery();
  const {base_url} = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeRoute = usePreviewRoute();

  useEffect(() => {
    // only set defaults snapshot once on route init
    if (data?.defaults && !appearanceState().defaults) {
      appearanceState().setDefaults(data.defaults);
    }
  }, [data]);

  useEffect(() => {
    if (iframeRef.current) {
      appearanceState().setIframeWindow(iframeRef.current.contentWindow!);
    }
  }, []);

  // make sure appearance editor iframe can't be nested
  if (isAppearanceEditorActive) {
    return <Navigate to="/admin" />;
  }

  // set key so iframe is recreated on route change and there's no entry pushed into history stack
  return (
    <div className="h-screen items-center md:flex">
      <StaticPageTitle>
        <Trans message="Appearance" />
      </StaticPageTitle>
      <Sidebar values={data?.values} />
      <div className="relative h-full flex-auto">
        <iframe
          key={iframeRoute}
          ref={iframeRef}
          className="h-full w-full max-md:hidden"
          src={
            iframeRoute && iframeRoute !== '/'
              ? `${base_url}/${iframeRoute}?appearanceEditor=true`
              : `${base_url}?appearanceEditor=true`
          }
        />
      </div>
    </div>
  );
}

interface SidebarProps {
  values: AppearanceEditorValues | undefined;
}
function Sidebar({values}: SidebarProps) {
  const spinner = (
    <div className="flex h-full flex-auto items-center justify-center">
      <ProgressCircle isIndeterminate aria-label="Loading editor" />
    </div>
  );

  return (
    <div className="relative z-10 h-full w-full border-r bg shadow-lg @container md:w-320">
      {values ? <Outlet /> : spinner}
    </div>
  );
}
