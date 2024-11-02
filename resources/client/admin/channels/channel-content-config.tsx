import {message} from '@ui/i18n/message';
import {Channel, CHANNEL_MODEL} from '@common/channels/channel';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';
import {GridViewIcon} from '@ui/icons/material/GridView';
import {ViewWeekIcon} from '@ui/icons/material/ViewWeek';
import {ViewListIcon} from '@ui/icons/material/ViewList';
import {Artist, ARTIST_MODEL} from '@app/web-player/artists/artist';
import {Album, ALBUM_MODEL} from '@app/web-player/albums/album';
import {Track, TRACK_MODEL} from '@app/web-player/tracks/track';
import {Playlist, PLAYLIST_MODEL} from '@app/web-player/playlists/playlist';
import {User, USER_MODEL} from '@ui/types/user';
import {Genre, GENRE_MODEL} from '@app/web-player/genres/genre';

export enum Sort {
  popular = 'popularity:desc',
  recent = 'created_at:desc',
  releaseDate = 'release_date:desc',
  curated = 'channelables.order:asc',
  attachDate = 'channelables.created_at:desc',
}
export enum Layout {
  grid = 'grid',
  table = 'trackTable',
  list = 'list',
  carousel = 'carousel',
}

enum Auto {
  topTracks = 'topTracks',
  newAlbums = 'newAlbums',
  playlistTracks = 'playlistTracks',
  topGenres = 'topGenres',
  nonEmptyGenres = 'nonEmptyGenres',
}

enum Restrictions {
  genre = 'genre',
}

const contentModels: ChannelContentConfig['models'] = {
  [ARTIST_MODEL]: {
    label: message('Artists'),
    sortMethods: [Sort.popular, Sort.recent],
    layoutMethods: [Layout.grid, Layout.carousel],
    autoUpdateMethods: [],
    restrictions: [Restrictions.genre],
  },
  [ALBUM_MODEL]: {
    label: message('Albums'),
    sortMethods: [Sort.popular, Sort.recent, Sort.releaseDate],
    layoutMethods: [Layout.grid, Layout.carousel],
    autoUpdateMethods: [Auto.newAlbums],
    restrictions: [Restrictions.genre],
  },
  [TRACK_MODEL]: {
    label: message('Tracks'),
    sortMethods: [Sort.popular, Sort.recent],
    layoutMethods: [Layout.grid, Layout.table, Layout.list, Layout.carousel],
    autoUpdateMethods: [Auto.topTracks, Auto.playlistTracks],
    restrictions: [Restrictions.genre],
  },
  [PLAYLIST_MODEL]: {
    label: message('Playlists'),
    sortMethods: [Sort.popular, Sort.recent],
    layoutMethods: [Layout.grid, Layout.carousel],
  },
  [USER_MODEL]: {
    label: message('Users'),
    sortMethods: [Sort.recent],
    layoutMethods: [Layout.grid, Layout.carousel],
    autoUpdateMethods: [],
  },
  [GENRE_MODEL]: {
    label: message('Genres'),
    sortMethods: [Sort.popular, Sort.recent],
    layoutMethods: [Layout.grid, Layout.carousel],
    autoUpdateMethods: [Auto.topGenres, Auto.nonEmptyGenres],
  },
  [CHANNEL_MODEL]: {
    label: message('Channels'),
    sortMethods: [],
    layoutMethods: [Layout.list],
  },
};

const contentSortingMethods: Record<
  Sort,
  ChannelContentConfig['sortingMethods']['any']
> = {
  [Sort.popular]: {
    label: message('Most popular first'),
  },
  [Sort.recent]: {
    label: message('Recently added first'),
  },
  [Sort.curated]: {
    label: message('Curated (reorder below)'),
    contentTypes: ['manual'],
  },
  [Sort.attachDate]: {
    label: message('Items recently added to channel first'),
  },
  [Sort.releaseDate]: {
    label: message('Most recent first (by release date)'),
  },
};

const contentLayoutMethods: Record<
  Layout,
  ChannelContentConfig['layoutMethods']['any']
> = {
  [Layout.grid]: {
    label: message('Grid'),
    icon: <GridViewIcon />,
  },
  [Layout.table]: {
    label: message('Table'),
    icon: <ViewWeekIcon />,
  },
  [Layout.list]: {
    label: message('List'),
    icon: <ViewListIcon />,
  },
  [Layout.carousel]: {
    label: message('Carousel'),
  },
};

const contentAutoUpdateMethods: Record<
  Auto,
  ChannelContentConfig['autoUpdateMethods']['any']
> = {
  [Auto.topTracks]: {
    label: message('Top tracks'),
    providers: ['spotify', 'local'],
  },
  [Auto.newAlbums]: {
    label: message('New releases'),
    providers: ['spotify', 'local'],
  },
  [Auto.playlistTracks]: {
    label: message('Playlist tracks'),
    providers: ['spotify', 'local'],
    value: {
      label: message('Playlist ID'),
      inputType: 'text',
    },
  },
  [Auto.topGenres]: {
    label: message('Popular genres'),
    providers: ['lastfm', 'local'],
  },
  [Auto.nonEmptyGenres]: {
    label: message('Genres that have content'),
    providers: ['local'],
  },
};

const contentRestrictions: Record<
  Restrictions,
  ChannelContentConfig['restrictions']['any']
> = {
  [Restrictions.genre]: {
    label: message('Genre'),
    value: Restrictions.genre,
  },
};

export const channelContentConfig: ChannelContentConfig = {
  models: contentModels,
  sortingMethods: contentSortingMethods,
  layoutMethods: contentLayoutMethods,
  autoUpdateMethods: contentAutoUpdateMethods,
  userSelectableLayouts: [Layout.grid, Layout.table, Layout.list],
  restrictions: contentRestrictions,
};

export type ChannelContentModel = (
  | Artist
  | Album
  | Track
  | Playlist
  | User
  | Genre
  | Channel
) & {
  channelable_id?: number;
  channelable_order?: number;
};
