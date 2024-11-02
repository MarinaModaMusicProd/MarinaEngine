import {
  IAppearanceConfig,
  MenuSectionConfig,
} from '@common/admin/appearance/types/appearance-editor-config';
import {message} from '@ui/i18n/message';

export const DefaultAppearanceConfig: IAppearanceConfig = {
  preview: {
    defaultRoute: '/',
    navigationRoutes: [],
  },
  sections: {
    general: {
      label: message('General'),
      position: 1,
    },
    themes: {
      label: message('Themes'),
      position: 2,
    },
    menus: {
      label: message('Menus'),
      position: 3,
      config: {
        availableRoutes: [
          '/',
          '/login',
          '/register',
          '/contact',
          '/pricing',
          '/account-settings',
          '/admin',
          '/admin/appearance',
          '/admin/settings',
          '/admin/plans',
          '/admin/subscriptions',
          '/admin/users',
          '/admin/roles',
          '/admin/pages',
          '/admin/tags',
          '/admin/files',
          '/admin/localizations',
          '/admin/ads',
          '/admin/logs',
          '/admin/settings/authentication',
          '/admin/settings/branding',
          '/admin/settings/cache',
          '/admin/settings/providers',
          '/api-docs',
        ],
        positions: [
          'admin-navbar',
          'admin-sidebar',
          'custom-page-navbar',
          'auth-page-footer',
          'auth-dropdown',
          'account-settings-page',
          'billing-page',
          'checkout-page-navbar',
          'checkout-page-footer',
          'pricing-table-page',
          'contact-us-page',
          'notifications-page',
          'footer',
          'footer-secondary',
        ],
      } as MenuSectionConfig,
    },
    'custom-code': {
      label: message('Custom Code'),
      position: 4,
    },
    'seo-settings': {
      label: message('SEO Settings'),
      position: 5,
    },
  },
};
