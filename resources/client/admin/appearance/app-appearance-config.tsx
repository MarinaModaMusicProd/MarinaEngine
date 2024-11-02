import {
  IAppearanceConfig,
  MenuSectionConfig,
  SeoSettingsSectionConfig,
} from '@common/admin/appearance/types/appearance-editor-config';
import {message} from '@ui/i18n/message';
import {lazyAdminRoute} from '@common/admin/routes/lazy-admin-route';

export const AppAppearanceConfig: IAppearanceConfig = {
  preview: {
    defaultRoute: '',
    navigationRoutes: [''],
  },
  sections: {
    'landing-page': {
      label: message('Landing Page'),
      position: 1,
      previewRoute: 'landing',
      routes: [
        {
          path: 'landing-page',
          lazy: () => lazyAdminRoute('LandingPageAppearanceForm'),
          children: [
            {
              index: true,
              lazy: () => lazyAdminRoute('LandingPageSectionGeneral'),
            },
            {
              path: 'action-buttons',
              lazy: () => lazyAdminRoute('LandingPageSectionActionButtons'),
            },
            {
              path: 'primary-features',
              lazy: () => lazyAdminRoute('LandingPageSectionPrimaryFeatures'),
            },
            {
              path: 'secondary-features',
              lazy: () => lazyAdminRoute('LandingPageSecondaryFeatures'),
            },
          ],
        },
      ],
    },
    // missing label will get added by deepMerge from default config
    // @ts-ignore
    menus: {
      config: {
        positions: [
          'sidebar-primary',
          'sidebar-secondary',
          'mobile-bottom',
          'landing-page-navbar',
        ],
        availableRoutes: [
          '/upload',
          '/search',
          '/library',
          '/library/songs',
          '/library/albums',
          '/library/artists',
          '/library/history',
          '/admin/upload',
          '/admin/channels',
          '/admin/artists',
          '/admin/albums',
          '/admin/tracks',
          '/admin/genres',
          '/admin/lyrics',
          '/admin/playlists',
          '/admin/backstage-requests',
          '/admin/comments',
          '/backstage/requests',
        ],
      } as MenuSectionConfig,
    },
    // @ts-ignore
    'seo-settings': {
      config: {
        pages: [
          {
            key: 'artist-page',
            label: message('Artist page'),
          },
          {
            key: 'album-page',
            label: message('Album page'),
          },
          {
            key: 'track-page',
            label: message('Track page'),
          },
          {
            key: 'playlist-page',
            label: message('Playlist page'),
          },
          {
            key: 'landing-page',
            label: message('Landing page'),
          },
          {
            key: 'channel-page',
            label: message('Channel page'),
          },
          {
            key: 'user-profile-page',
            label: message('User profile page'),
          },
          {
            key: 'search-page',
            label: message('Search page'),
          },
        ],
      } as SeoSettingsSectionConfig,
    },
  },
};
