import {Trans} from '@ui/i18n/trans';
import {AudiotrackIcon} from '@ui/icons/material/Audiotrack';
import {StaticPageTitle} from '@common/seo/static-page-title';
import React, {ReactElement, ReactNode} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {AlbumIcon} from '@ui/icons/material/Album';
import {MicIcon} from '@ui/icons/material/Mic';
import {PlaylistPlayIcon} from '@ui/icons/material/PlaylistPlay';
import {HistoryIcon} from '@ui/icons/material/History';
import {SvgIconProps} from '@ui/icons/svg-icon';
import {getPlaylistLink} from '@app/web-player/playlists/playlist-link';
import {IconButton} from '@ui/buttons/icon-button';
import {PlaylistAddIcon} from '@ui/icons/material/PlaylistAdd';
import {CreatePlaylistDialog} from '@app/web-player/playlists/crupdate-dialog/create-playlist-dialog';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useAuthClickCapture} from '@app/web-player/use-auth-click-capture';
import {useUserPlaylists} from '@app/web-player/library/requests/use-user-playlists';
import {PlaylistImage} from '@app/web-player/playlists/playlist-image';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import {AdHost} from '@common/admin/ads/ad-host';
import {useIsTabletMediaQuery} from '@ui/utils/hooks/is-tablet-media-query';

export function LibraryPage() {
  const navigate = useNavigate();
  const authHandler = useAuthClickCapture();
  const query = useUserPlaylists('me');
  const isSmallScreen = useIsTabletMediaQuery();

  if (!isSmallScreen) {
    return <Navigate to="/library/songs" replace />;
  }

  return (
    <div>
      <StaticPageTitle>
        <Trans message="Your tracks" />
      </StaticPageTitle>
      <AdHost slot="general_top" className="mb-34" />
      <div className="mb-20 flex items-center justify-between gap-24">
        <h1 className="whitespace-nowrap text-2xl font-semibold">
          <Trans message="Your library" />
        </h1>
        <DialogTrigger
          type="modal"
          onClose={newPlaylist => {
            if (newPlaylist) {
              navigate(getPlaylistLink(newPlaylist));
            }
          }}
        >
          <IconButton className="flex-shrink-0" onClickCapture={authHandler}>
            <PlaylistAddIcon />
          </IconButton>
          <CreatePlaylistDialog />
        </DialogTrigger>
      </div>
      <div>
        <MenuItem
          icon={<AudiotrackIcon className="text-main" />}
          to="/library/songs"
        >
          <Trans message="Songs" />
        </MenuItem>
        <MenuItem icon={<PlaylistPlayIcon />} to="/library/playlists">
          <Trans message="Playlists" />
        </MenuItem>
        <MenuItem icon={<AlbumIcon />} to="/library/albums">
          <Trans message="Albums" />
        </MenuItem>
        <MenuItem icon={<MicIcon />} to="/library/artists">
          <Trans message="Artists" />
        </MenuItem>
        <MenuItem icon={<HistoryIcon />} to="/library/history">
          <Trans message="Play history" />
        </MenuItem>
        {query.items.map(playlist => (
          <MenuItem
            key={playlist.id}
            wrapIcon={false}
            icon={
              <PlaylistImage
                size="w-42 h-42"
                className="rounded"
                playlist={playlist}
              />
            }
            to={getPlaylistLink(playlist)}
          >
            {playlist.name}
          </MenuItem>
        ))}
        <InfiniteScrollSentinel query={query} />
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: ReactElement<SvgIconProps>;
  children: ReactNode;
  to: string;
  wrapIcon?: boolean;
}
function MenuItem({icon, children, to, wrapIcon = true}: MenuItemProps) {
  return (
    <Link className="mb-18 flex items-center gap-14 text-sm" to={to}>
      {wrapIcon ? (
        <div className="h-42 w-42 rounded bg-chip p-8">{icon}</div>
      ) : (
        icon
      )}
      {children}
    </Link>
  );
}
