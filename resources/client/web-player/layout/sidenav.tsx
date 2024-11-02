import {useSettings} from '@ui/settings/use-settings';
import {Link, NavLink} from 'react-router-dom';
import {useTrans} from '@ui/i18n/use-trans';
import {useIsDarkMode} from '@ui/themes/use-is-dark-mode';
import {CustomMenu} from '@common/menus/custom-menu';
import {Trans} from '@ui/i18n/trans';
import {IconButton} from '@ui/buttons/icon-button';
import {PlaylistAddIcon} from '@ui/icons/material/PlaylistAdd';
import {ReactNode} from 'react';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {CreatePlaylistDialog} from '@app/web-player/playlists/crupdate-dialog/create-playlist-dialog';
import {useAuthUserPlaylists} from '@app/web-player/playlists/requests/use-auth-user-playlists';
import {getPlaylistLink} from '@app/web-player/playlists/playlist-link';
import clsx from 'clsx';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useAuthClickCapture} from '@app/web-player/use-auth-click-capture';

const menuItemClassName = (isActive: boolean): string => {
  return clsx(
    'h-44 px-12 mx-12 hover:bg-hover rounded-button',
    isActive && 'text-primary',
  );
};

interface Props {
  className?: string;
}
export function Sidenav({className}: Props) {
  return (
    <div className={clsx('overflow-y-auto border-r bg-alt py-12', className)}>
      <Logo />
      <CustomMenu
        className="mt-24 items-stretch"
        menu="sidebar-primary"
        orientation="vertical"
        gap="gap-none"
        iconClassName="text-muted"
        itemClassName={({isActive}) => menuItemClassName(isActive)}
      />
      <div className="mt-48">
        <SectionTitle>
          <Trans message="Your Music" />
        </SectionTitle>
        <CustomMenu
          className="mt-12 items-stretch text-sm"
          menu="sidebar-secondary"
          orientation="vertical"
          gap="gap-none"
          iconClassName="text-muted"
          itemClassName={({isActive}) => menuItemClassName(isActive)}
        />
        <PlaylistSection />
      </div>
    </div>
  );
}

interface SectionTitleProps {
  children?: ReactNode;
}
function SectionTitle({children}: SectionTitleProps) {
  return (
    <div className="mx-24 mb-8 text-xs font-semibold uppercase text-muted">
      {children}
    </div>
  );
}

function Logo() {
  const {branding} = useSettings();
  const {trans} = useTrans();
  const isDarkMode = useIsDarkMode();
  const logoUrl = isDarkMode ? branding.logo_light : branding.logo_dark;

  return (
    <Link
      to="/"
      className="mx-18 block flex-shrink-0"
      aria-label={trans({message: 'Go to homepage'})}
    >
      <img
        className="block h-56 w-auto max-w-[188px] object-contain"
        src={logoUrl}
        alt={trans({message: 'Site logo'})}
      />
    </Link>
  );
}

function PlaylistSection() {
  const {data} = useAuthUserPlaylists();
  const navigate = useNavigate();
  const authHandler = useAuthClickCapture();

  return (
    <div className="mt-40">
      <div className="mr-24 flex items-center justify-between">
        <SectionTitle>
          <Trans message="Playlists" />
        </SectionTitle>
        <DialogTrigger
          type="modal"
          onClose={newPlaylist => {
            if (newPlaylist) {
              navigate(getPlaylistLink(newPlaylist));
            }
          }}
        >
          <IconButton
            className="flex-shrink-0 text-muted"
            onClickCapture={authHandler}
          >
            <PlaylistAddIcon />
          </IconButton>
          <CreatePlaylistDialog />
        </DialogTrigger>
      </div>
      {data?.playlists?.map(playlist => (
        <NavLink
          to={getPlaylistLink(playlist)}
          key={playlist.id}
          className={({isActive}) =>
            clsx(menuItemClassName(isActive), 'flex items-center text-sm')
          }
        >
          <div className="overflow-hidden overflow-ellipsis">
            {playlist.name}
          </div>
        </NavLink>
      ))}
    </div>
  );
}
