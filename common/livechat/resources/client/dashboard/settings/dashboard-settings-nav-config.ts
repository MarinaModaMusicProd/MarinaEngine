import {message} from '@ui/i18n/message';
import {SettingsNavItem} from '@common/admin/settings/settings-nav-config';

export const DashboardSettingsNavConfig: SettingsNavItem[] = [
  {label: message('Chat settings'), to: 'chat'},
  {label: message('General'), to: 'general'},
  {label: message('Localization'), to: 'localization'},
  {label: message('Uploading'), to: 'uploading'},
  {label: message('Outgoing email'), to: 'outgoing-email'},
  {label: message('Cache'), to: 'cache'},
  {label: message('Logging'), to: 'logging'},
  {label: message('Queue'), to: 'queue'},
  {
    label: message('Menus'),
    to: '/admin/appearance/menus',
  },
  {
    label: message('Themes'),
    to: '/admin/appearance/themes',
  },
];
