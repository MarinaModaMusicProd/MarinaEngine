import {RouteObject} from 'react-router-dom';
import {authGuard} from '@common/auth/guards/auth-route';

const lazyRoute = async (
  cmp: keyof typeof import('@app/web-player/backstage/routes/backstage-routes.lazy'),
) => {
  const exports = await import(
    '@app/web-player/backstage/routes/backstage-routes.lazy'
  );
  return {
    Component: exports[cmp],
  };
};

export const backstageRoutes: RouteObject[] = [
  // Backstage request form
  {
    loader: () => authGuard({permission: 'backstageRequests.create'}),
    children: [
      {
        path: 'backstage/requests',
        lazy: () => lazyRoute('BackstageTypeSelector'),
      },
      {
        path: 'backstage/requests/verify-artist',
        lazy: () => lazyRoute('BackstageRequestFormPage'),
      },
      {
        path: 'backstage/requests/become-artist',
        lazy: () => lazyRoute('BackstageRequestFormPage'),
      },
      {
        path: 'backstage/requests/claim-artist',
        lazy: () => lazyRoute('BackstageRequestFormPage'),
      },
      {
        path: 'backstage/requests/:requestId/request-submitted',
        lazy: () => lazyRoute('BackstageRequestSubmittedPage'),
      },
    ],
  },

  {
    path: 'backstage/upload',
    loader: () => authGuard({permission: 'music.create'}),
    lazy: () => lazyRoute('BackstageUploadPage'),
  },

  // Tracks
  {
    path: 'backstage/tracks/new',
    loader: () => authGuard({permission: 'music.create'}),
    lazy: () => lazyRoute('BackstageCreateTrackPage'),
  },
  {
    path: 'backstage/tracks/:trackId/edit',
    lazy: () => lazyRoute('BackstageUpdateTrackPage'),
  },
  {
    path: 'backstage/tracks/:trackId/insights',
    lazy: () => lazyRoute('BackstageTrackInsights'),
  },

  // Albums
  {
    path: 'backstage/albums/new',
    loader: () => authGuard({permission: 'music.create'}),
    lazy: () => lazyRoute('BackstageCreateAlbumPage'),
  },
  {
    path: 'backstage/albums/:albumId/edit',
    lazy: () => lazyRoute('BackstageUpdateAlbumPage'),
  },
  {
    path: 'backstage/albums/:albumId/insights',
    lazy: () => lazyRoute('BackstageAlbumInsights'),
  },

  // Artists
  {
    path: 'backstage/artists/:artistId/edit',
    lazy: () => lazyRoute('BackstageUpdateArtistPage'),
  },
  {
    path: 'backstage/artists/:artistId/insights',
    lazy: () => lazyRoute('BackstageArtistInsights'),
  },
];
