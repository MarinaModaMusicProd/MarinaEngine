import {Navigate, RouteObject} from 'react-router-dom';
import {authGuard} from '@common/auth/guards/auth-route';
import {appAdminRoutes} from '@app/admin/routes/app-admin-routes';
import {AppAppearanceConfig} from '@app/admin/appearance/app-appearance-config';
import {lazyAdminRoute} from '@common/admin/routes/lazy-admin-route';
import {appSettingsRoutes} from '@app/admin/settings/app-settings-routes';

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    loader: () => authGuard({permission: 'admin.access'}),
    lazy: () => lazyAdminRoute('AdminLayout'),
    children: [
      ...appAdminRoutes,
      // REPORT PAGE
      {
        index: true,
        lazy: () => import('@common/admin/analytics/admin-report-page'),
      },
      // USERS
      {
        path: 'users',
        loader: () => authGuard({permission: 'users.update'}),
        lazy: () => lazyAdminRoute('UserDatatable'),
      },
      {
        path: 'users/:userId',
        loader: () => authGuard({permission: 'users.update'}),
        lazy: () => lazyAdminRoute('UpdateUserPage'),
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />,
          },
          {
            path: 'details',
            lazy: () => lazyAdminRoute('UpdateUserDetailsTab'),
          },
          {
            path: 'permissions',
            lazy: () => lazyAdminRoute('UpdateUserPermissionsTab'),
          },
          {
            path: 'security',
            lazy: () => lazyAdminRoute('UpdateUserSecurityTab'),
          },
          {
            path: 'date',
            lazy: () => lazyAdminRoute('UpdateUserDatetimeTab'),
          },
          {
            path: 'api',
            lazy: () => lazyAdminRoute('UpdateUserApiTab'),
          },
        ],
      },
      // ROLES
      {
        path: 'roles',
        loader: () => authGuard({permission: 'roles.update'}),
        lazy: () => lazyAdminRoute('RolesIndexPage'),
      },
      {
        path: 'roles/new',
        loader: () => authGuard({permission: 'roles.update'}),
        lazy: () => lazyAdminRoute('CreateRolePage'),
      },
      {
        path: 'roles/:roleId/edit',
        loader: () => authGuard({permission: 'roles.update'}),
        lazy: () => lazyAdminRoute('EditRolePage'),
      },
      // SUBSCRIPTIONS and PLANS
      {
        path: 'subscriptions',
        loader: () => authGuard({permission: 'subscriptions.update'}),
        lazy: () => lazyAdminRoute('SubscriptionsIndexPage'),
      },
      {
        path: 'plans',
        loader: () => authGuard({permission: 'plans.update'}),
        lazy: () => lazyAdminRoute('PlansIndexPage'),
      },
      {
        path: 'plans/new',
        loader: () => authGuard({permission: 'plans.update'}),
        lazy: () => lazyAdminRoute('CreatePlanPage'),
      },
      {
        path: 'plans/:productId/edit',
        loader: () => authGuard({permission: 'plans.update'}),
        lazy: () => lazyAdminRoute('EditPlanPage'),
      },
      // CUSTOM PAGES
      {
        path: 'custom-pages',
        loader: () => authGuard({permission: 'custom_pages.update'}),
        lazy: () => lazyAdminRoute('CustomPageDatablePage'),
      },
      {
        path: 'custom-pages/new',
        loader: () => authGuard({permission: 'custom_pages.update'}),
        lazy: () => lazyAdminRoute('CreateCustomPage'),
      },
      {
        path: 'custom-pages/:pageId/edit',
        loader: () => authGuard({permission: 'custom_pages.update'}),
        lazy: () => lazyAdminRoute('EditCustomPage'),
      },
      // TAGS
      {
        path: 'tags',
        loader: () => authGuard({permission: 'tags.update'}),
        lazy: () => lazyAdminRoute('TagIndexPage'),
      },
      // LOCALIZATIONS
      {
        path: 'localizations',
        loader: () => authGuard({permission: 'localizations.update'}),
        lazy: () => lazyAdminRoute('LocalizationIndex'),
      },
      {
        lazy: () => lazyAdminRoute('TranslationManagementPage'),
        path: 'localizations/:localeId/translate',
      },
      // FILE ENTRIES
      {
        path: 'files',
        loader: () => authGuard({permission: 'files.update'}),
        lazy: () => lazyAdminRoute('FileEntryIndexPage'),
      },
      // ADS
      {
        path: 'ads',
        loader: () => authGuard({permission: 'settings.update'}),
        lazy: () => lazyAdminRoute('AdsPage'),
      },
      // SETTINGS
      {
        path: 'settings',
        loader: () => authGuard({permission: 'settings.update'}),
        lazy: () => lazyAdminRoute('AdminSettingsPage'),
        children: [
          {index: true, element: <Navigate to="general" replace />},
          {path: 'general', lazy: () => lazyAdminRoute('GeneralSettings')},
          {
            path: 'subscriptions',
            lazy: () => lazyAdminRoute('SubscriptionSettings'),
          },
          {
            path: 'localization',
            lazy: () => lazyAdminRoute('LocalizationSettings'),
          },
          {
            path: 'authentication',
            lazy: () => lazyAdminRoute('AuthenticationSettings'),
          },
          {path: 'uploading', lazy: () => lazyAdminRoute('UploadingSettings')},
          {
            path: 'outgoing-email',
            lazy: () => lazyAdminRoute('OutgoingEmailSettings'),
          },
          {path: 'cache', lazy: () => lazyAdminRoute('CacheSettings')},
          {path: 'analytics', lazy: () => lazyAdminRoute('ReportsSettings')},
          {path: 'logging', lazy: () => lazyAdminRoute('LoggingSettings')},
          {path: 'queue', lazy: () => lazyAdminRoute('QueueSettings')},
          {path: 'websockets', lazy: () => lazyAdminRoute('WebsocketSettings')},
          {path: 'recaptcha', lazy: () => lazyAdminRoute('RecaptchaSettings')},
          {path: 'gdpr', lazy: () => lazyAdminRoute('GdprSettings')},
          ...appSettingsRoutes,
        ],
      },
      // LOGS
      {
        path: 'logs',
        loader: () => authGuard({permission: 'logs.view'}),
        lazy: () => lazyAdminRoute('LogsPage'),
        children: [
          {index: true, lazy: () => lazyAdminRoute('ScheduleLogDatatable')},
          {
            path: 'schedule',
            lazy: () => lazyAdminRoute('ScheduleLogDatatable'),
          },
          {path: 'error', lazy: () => lazyAdminRoute('ErrorLogDatatable')},
          {
            path: 'outgoing-email',
            lazy: () => lazyAdminRoute('OutgoingEmailLogDatatable'),
          },
        ],
      },
    ],
  },

  // APPEARANCE EDITOR
  {
    path: 'admin/appearance',
    loader: () => authGuard({permission: 'appearance.update'}),
    lazy: () => lazyAdminRoute('AppearanceEditorPage'),
    children: [
      {index: true, lazy: () => lazyAdminRoute('SectionList')},
      {path: 'general', lazy: () => lazyAdminRoute('GeneralSection')},
      {path: 'seo-settings', lazy: () => lazyAdminRoute('SeoSection')},
      {path: 'custom-code', lazy: () => lazyAdminRoute('CustomCodeSection')},
      {
        path: 'themes',
        lazy: () => lazyAdminRoute('ThemeEditorForm'),
        children: [
          {index: true, lazy: () => lazyAdminRoute('ThemeList')},
          {path: ':themeIndex', lazy: () => lazyAdminRoute('ThemeEditor')},
          {
            path: ':themeIndex/font',
            lazy: () => lazyAdminRoute('ThemeFontPanel'),
          },
          {
            path: ':themeIndex/radius',
            lazy: () => lazyAdminRoute('ThemeRadiusPanel'),
          },
        ],
      },
      {
        path: 'menus',
        lazy: () => lazyAdminRoute('MenuEditorForm'),
        children: [
          {index: true, lazy: () => lazyAdminRoute('MenuList')},
          {
            path: ':menuIndex',
            lazy: () => lazyAdminRoute('AppearanceMenuEditor'),
          },
          {
            path: ':menuIndex/:menuItemIndex',
            lazy: () => lazyAdminRoute('AppearanceMenuItemEditor'),
          },
        ],
      },
      ...Object.values(AppAppearanceConfig.sections).flatMap(
        s => s.routes || [],
      ),
    ],
  },
];
