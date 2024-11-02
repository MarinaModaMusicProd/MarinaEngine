import {RouteObject} from 'react-router-dom';
import {lazyAdminRoute} from '@common/admin/routes/lazy-admin-route';

export const appAdminRoutes: RouteObject[] = [
  // Reports
  {
    path: '',
    lazy: () => lazyAdminRoute('MarinaModaAdminReportPage'),
    children: [
      {index: true, lazy: () => lazyAdminRoute('AdminInsightsReport')},
      {path: 'plays', lazy: () => lazyAdminRoute('AdminInsightsReport')},
      {path: 'visitors', lazy: () => lazyAdminRoute('AdminVisitorsReport')},
    ],
  },
  // Channels
  {
    path: 'channels',
    lazy: () => lazyAdminRoute('ChannelsDatatablePage'),
  },
  {
    path: 'channels/new',
    lazy: () => lazyAdminRoute('CreateChannelPage'),
  },
  {
    path: 'channels/:slugOrId/edit',
    lazy: () => lazyAdminRoute('EditChannelPage'),
  },
  // Tracks
  {
    path: 'tracks',
    lazy: () => lazyAdminRoute('TracksDatatablePage'),
  },
  {
    path: 'tracks/new',
    lazy: () => lazyAdminRoute('CreateTrackPage'),
  },
  {
    path: 'tracks/:trackId/edit',
    lazy: () => lazyAdminRoute('UpdateTrackPage'),
  },
  {
    path: 'tracks/:trackId/insights',
    lazy: () => lazyAdminRoute('NestedBackstageTrackInsights'),
  },
  // Albums
  {
    path: 'albums',
    lazy: () => lazyAdminRoute('AlbumsDatatablePage'),
  },
  {
    path: 'albums/new',
    lazy: () => lazyAdminRoute('CreateAlbumPage'),
  },
  {
    path: 'albums/:albumId/edit',
    lazy: () => lazyAdminRoute('UpdateAlbumPage'),
  },
  {
    path: 'albums/:albumId/insights',
    lazy: () => lazyAdminRoute('NestedBackstageAlbumInsights'),
  },
  // Artists
  {
    path: 'artists',
    lazy: () => lazyAdminRoute('ArtistDatatablePage'),
  },
  {
    path: 'artists/new',
    lazy: () => lazyAdminRoute('CreateArtistPageWithExternalFields'),
  },
  {
    path: 'artists/:artistId/edit',
    lazy: () => lazyAdminRoute('UpdateArtistPageWithExternalFields'),
  },
  {
    path: 'artists/:artistId/insights',
    lazy: () => lazyAdminRoute('NestedBackstageArtistInsights'),
  },
  // Upload
  {
    path: 'upload',
    lazy: () => lazyAdminRoute('UploadPage'),
  },
  // Backstage requests
  {
    path: 'backstage-requests',
    lazy: () => lazyAdminRoute('BackstageRequestsDatatablePage'),
  },
  {
    path: 'backstage-requests/:requestId',
    lazy: () => lazyAdminRoute('ViewBackstageRequestPage'),
  },
  // Genres
  {
    path: 'genres',
    lazy: () => lazyAdminRoute('GenresDatatablePage'),
  },
  // Playlists
  {
    path: 'playlists',
    lazy: () => lazyAdminRoute('PlaylistDatatablePage'),
  },
  // Lyrics
  {
    path: 'lyrics',
    lazy: () => lazyAdminRoute('LyricsDatatablePage'),
  },
  // Comments
  {
    path: 'comments',
    lazy: () => lazyAdminRoute('CommentsDatatablePage'),
  },
];
