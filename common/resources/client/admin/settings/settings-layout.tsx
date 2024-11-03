import clsx from 'clsx';
import {NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {SettingsNavConfig, SettingsNavItem} from './settings-nav-config';
import {useIsMobileMediaQuery} from '@ui/utils/hooks/is-mobile-media-query';
import {Option, Select} from '@ui/forms/select/select';
import {Trans} from '@ui/i18n/trans';
import {StaticPageTitle} from '../../seo/static-page-title';

interface Props {
  className?: string;
  navConfig?: SettingsNavItem[];
}
export function SettingsLayout({className, navConfig}: Props) {
  const isMobile = useIsMobileMediaQuery();

  if (!navConfig) {
    navConfig = SettingsNavConfig;
  }

  return (
    <div
      className={clsx(
        className,
        'container mx-auto min-h-full items-start gap-30 p-24 md:flex',
      )}
    >
      <StaticPageTitle>
        <Trans message="Settings" />
      </StaticPageTitle>
      {isMobile ? (
        <MobileNav navConfig={navConfig} />
      ) : (
        <DesktopNav navConfig={navConfig} />
      )}
      <div className="relative max-w-500 flex-auto md:px-30">
        <Outlet />
      </div>
    </div>
  );
}

interface NavProps {
  navConfig: SettingsNavItem[];
}
function MobileNav({navConfig}: NavProps) {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const value = pathname.split('/').pop();

  return (
    <Select
      minWidth="min-w-none"
      className="mb-24 w-full bg"
      selectionMode="single"
      selectedValue={value}
      onSelectionChange={newPage => {
        navigate(newPage as string);
      }}
    >
      {navConfig.map(item => (
        <Option key={item.to as string} value={item.to}>
          <Trans {...item.label} />
        </Option>
      ))}
    </Select>
  );
}

function DesktopNav({navConfig}: NavProps) {
  return (
    <div className="sticky top-24 w-240 flex-shrink-0">
      {navConfig.map(item => (
        <NavLink
          key={item.to as string}
          to={item.to}
          className={({isActive}) =>
            clsx(
              'mb-8 block whitespace-nowrap rounded-button p-14 text-sm transition-bg-color',
              isActive
                ? 'bg-primary/6 font-semibold text-primary'
                : 'hover:bg-hover',
            )
          }
        >
          <Trans {...item.label} />
        </NavLink>
      ))}
    </div>
  );
}
