import {RouteObject} from 'react-router-dom';
import {authGuard} from '@common/auth/guards/auth-route';

const lazyRoute = async (
  cmp: keyof typeof import('@app/web-player/routes/web-player-routes.lazy'),
) => {
  const exports = await import('@app/web-player/routes/web-player-routes.lazy');
  return {
    Component: exports[cmp],
  };
};

export const webPlayerRoutes: RouteObject[] = [
  {
    path: 'track/:trackId/:trackName/embed',
    loader: () => authGuard({permission: 'music.view', requireLogin: false}),
    lazy: () => lazyRoute('TrackEmbed'),
  },
  {
    path: 'album/:albumId/:artistName/:albumName/embed',
    loader: () => authGuard({permission: 'music.view', requireLogin: false}),
    lazy: () => lazyRoute('AlbumEmbed'),
  },
  {
    path: 'landing',
    lazy: () => lazyRoute('LandingPage'),
  },
  {
    path: '/',
    id: 'webPlayerRoot',
    lazy: () => lazyRoute('Homepage'),
    children: [
      {
        index: true,
        id: 'webPlayerIndex',
        lazy: () => lazyRoute('HomepageChannelPage'),
      },
      {
        path: 'lyrics',
        lazy: () => lazyRoute('LyricsPage'),
      },
      // artists
      {
        path: 'artist/:artistId/:artistName',
        lazy: () => lazyRoute('ArtistPage'),
      },
      {
        path: 'artist/:artistId',
        lazy: () => lazyRoute('ArtistPage'),
      },
      // playlists
      {
        path: 'playlist/:playlistId/:playlistName',
        lazy: () => lazyRoute('PlaylistPage'),
      },
      // albums
      {
        path: 'album/:albumId/:artistName/:albumName',
        lazy: () => lazyRoute('AlbumPage'),
      },
      // tracks
      {
        path: 'track/:trackId/:trackName',
        lazy: () => lazyRoute('TrackPage'),
      },
      // tags
      {
        path: 'tag/:tagName',
        lazy: () => lazyRoute('TagMediaPage'),
      },
      {
        path: 'tag/:tagName/tracks',
        lazy: () => lazyRoute('TagMediaPage'),
      },
      {
        path: 'tag/:tagName/albums',
        lazy: () => lazyRoute('TagMediaPage'),
      },
      // user profile
      {
        path: 'user/:userId/:userName',
        lazy: () => lazyRoute('UserProfilePage'),
      },
      {
        path: 'user/:userId/:userName/:tabName',
        lazy: () => lazyRoute('UserProfilePage'),
      },
      // radio
      {
        path: 'radio/:seedType/:seedId/:seeName',
        lazy: () => lazyRoute('RadioPage'),
      },
      // search
      {
        path: 'search',
        lazy: () => lazyRoute('SearchResultsPage'),
      },
      {
        path: 'search/:searchQuery',
        lazy: () => lazyRoute('SearchResultsPage'),
      },
      {
        path: 'search/:searchQuery/:tabName',
        lazy: () => lazyRoute('SearchResultsPage'),
      },

      // library
      {
        loader: () => authGuard(),
        children: [
          {
            path: 'library',
            lazy: () => lazyRoute('LibraryPage'),
          },
          {
            path: 'library/songs',
            lazy: () => lazyRoute('LibraryTracksPage'),
          },
          {
            path: 'library/playlists',
            lazy: () => lazyRoute('LibraryPlaylistsPage'),
          },
          {
            path: 'library/albums',
            lazy: () => lazyRoute('LibraryAlbumsPage'),
          },
          {
            path: 'library/artists',
            lazy: () => lazyRoute('LibraryArtistsPage'),
          },
          {
            path: 'library/history',
            lazy: () => lazyRoute('LibraryHistoryPage'),
          },
        ],
      },
      // Channels
      {
        path: ':slugOrId',
        lazy: () => lazyRoute('ChannelPage'),
      },
      {
        path: 'channel/:slugOrId',
        lazy: () => lazyRoute('ChannelPage'),
      },
      {
        path: ':slugOrId/:restriction',
        lazy: () => lazyRoute('ChannelPage'),
      },
      {
        path: 'channel/:slugOrId/:restriction',
        lazy: () => lazyRoute('ChannelPage'),
      },
    ],
  },
];
