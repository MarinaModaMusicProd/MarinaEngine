import {PaginationResponse} from '@common/http/backend-response/pagination-response';
import {User} from '@common/auth/user';
import {Track} from '@app/web-player/tracks/track';
import {Artist} from '@app/web-player/artists/artist';
import {Playlist} from '@app/web-player/playlists/playlist';
import {Genre} from '@app/web-player/genres/genre';
import {Album} from '@app/web-player/albums/album';

export const CHANNEL_MODEL = 'channel';

export type ChannelContentItem = (
  | Track
  | Album
  | Artist
  | Playlist
  | User
  | Channel
  | Genre
) & {
  channelable_id?: number;
  channelable_order?: number;
};

export interface Channel<T = ChannelContentItem> {
  id: number;
  name: string;
  slug: string;
  genre?: Genre;
  config: {
    carouselWhenNested: boolean;
    autoUpdateMethod?: string;
    disablePagination?: boolean;
    disablePlayback?: boolean;
    connectToGenreViaUrl?: boolean;
    contentModel?: string;
    contentType?: 'listAll' | 'manual' | 'autoUpdate';
    contentOrder?: string;
    layout: 'trackList' | 'trackTable' | 'grid';
    hideTitle?: boolean;
    lockSlug?: boolean;
    actions?: {tooltip: string; icon: string; route: string}[];
  };
  model_type: 'channel';
  updated_at?: string;
  content?: PaginationResponse<T>;
}
