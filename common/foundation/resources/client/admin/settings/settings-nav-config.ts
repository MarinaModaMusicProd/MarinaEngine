import {AppSettingsNavConfig} from '@app/admin/settings/app-settings-nav-config';
import {message} from '@ui/i18n/message';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';
import {getBootstrapData} from '@ui/bootstrap-data/bootstrap-data-store';

export interface SettingsNavItem {
  label: MessageDescriptor;
  to: string;
  position?: number;
}

const filteredSettingsNavConfig: (SettingsNavItem | false)[] = [
  {label: message('General'), to: 'general', position: 1},
  ...AppSettingsNavConfig,
  getBootstrapData().settings.billing.integrated && {
    label: message('Subscriptions'),
    to: 'subscriptions',
    position: 2,
  },
  {label: message('Localization'), to: 'localization', position: 3},
  {
    label: message('Authentication'),
    to: 'authentication',
    position: 4,
  },
  {label: message('Uploading'), to: 'uploading', position: 5},
  {label: message('Outgoing email'), to: 'outgoing-email', position: 6},
  {label: message('Cache'), to: 'cache', position: 7},
  {label: message('Analytics'), to: 'analytics', position: 8},
  {label: message('Logging'), to: 'logging', position: 9},
  {label: message('Queue'), to: 'queue', position: 10},
  {label: message('Recaptcha'), to: 'recaptcha', position: 11},
  {label: message('GDPR'), to: 'gdpr', position: 12},
  {
    label: message('Menus'),
    to: '/admin/appearance/menus',
    position: 13,
  },
  {
    label: message('Seo'),
    to: '/admin/appearance/seo-settings',
    position: 14,
  },
  {
    label: message('Themes'),
    to: '/admin/appearance/themes',
    position: 15,
  },
].filter(Boolean);

export const SettingsNavConfig = filteredSettingsNavConfig as SettingsNavItem[];
