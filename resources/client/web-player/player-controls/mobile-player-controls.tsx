import {useCuedTrack} from '@app/web-player/player-controls/use-cued-track';
import {TrackImage} from '@app/web-player/tracks/track-image/track-image';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import React, {useMemo} from 'react';
import {ProgressBar} from '@ui/progress/progress-bar';
import {CustomMenuItem} from '@common/menus/custom-menu';
import clsx from 'clsx';
import {useCustomMenu} from '@common/menus/use-custom-menu';
import {Trans} from '@ui/i18n/trans';
import {NavbarAuthMenu} from '@common/ui/navigation/navbar/navbar-auth-menu';
import {PersonIcon} from '@ui/icons/material/Person';
import {Badge} from '@ui/badge/badge';
import {useAuth} from '@common/auth/use-auth';
import {Menu, MenuItem, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useSettings} from '@ui/settings/use-settings';
import {playerOverlayState} from '@app/web-player/state/player-overlay-store';
import {usePrimaryArtistForCurrentUser} from '@app/web-player/backstage/use-primary-artist-for-current-user';
import {MicIcon} from '@ui/icons/material/Mic';
import {getArtistLink} from '@app/web-player/artists/artist-link';
import {useCurrentTime} from '@common/player/hooks/use-current-time';
import {PlayButton} from '@common/player/ui/controls/play-button';
import {PreviousButton} from '@common/player/ui/controls/previous-button';
import {NextButton} from '@common/player/ui/controls/next-button';
import {BufferingIndicator} from '@app/web-player/player-controls/buffering-indicator';

export function MobilePlayerControls() {
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-[calc(100%-20px)] bg-background/[0.98]">
      <PlayerControls />
      <MobileNavbar />
    </div>
  );
}

function PlayerControls() {
  const mediaIsCued = usePlayerStore(s => s.cuedMedia != null);
  if (!mediaIsCued) return null;

  return (
    <div
      className="relative flex items-center justify-between gap-24 rounded bg-chip p-6 shadow"
      onClick={() => {
        playerOverlayState.toggle();
      }}
    >
      <QueuedTrack />
      <PlaybackButtons />
      <PlayerProgressBar />
    </div>
  );
}

function QueuedTrack() {
  const track = useCuedTrack();

  if (!track) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-auto items-center gap-10">
      <TrackImage className="h-36 w-36 rounded object-cover" track={track} />
      <div className="flex-auto overflow-hidden whitespace-nowrap">
        <div className="overflow-hidden overflow-ellipsis text-sm font-medium">
          {track.name}
        </div>
        <div className="overflow-hidden overflow-ellipsis text-xs text-muted">
          {track.artists?.map(a => a.name).join(', ')}
        </div>
      </div>
    </div>
  );
}

function PlaybackButtons() {
  return (
    <div className="flex items-center justify-center">
      <PreviousButton stopPropagation />
      <div className="relative">
        <BufferingIndicator />
        <PlayButton size="md" iconSize="lg" stopPropagation />
      </div>
      <NextButton stopPropagation />
    </div>
  );
}

function PlayerProgressBar() {
  const duration = usePlayerStore(s => s.mediaDuration);
  const currentTime = useCurrentTime();
  return (
    <ProgressBar
      size="xs"
      className="absolute bottom-0 left-0 right-0"
      progressColor="bg-white"
      trackColor="bg-white/10"
      trackHeight="h-2"
      radius="rounded-none"
      minValue={0}
      maxValue={duration}
      value={currentTime}
    />
  );
}

function MobileNavbar() {
  const menu = useCustomMenu('mobile-bottom');
  if (!menu) return null;

  return (
    <div className="my-12 flex items-center justify-center gap-30">
      {menu.items.map(item => (
        <CustomMenuItem
          unstyled
          iconClassName="block mx-auto mb-6"
          iconSize="md"
          className={({isActive}) =>
            clsx(
              'overflow-hidden whitespace-nowrap text-xs',
              isActive && 'font-bold',
            )
          }
          key={item.id}
          item={item}
        />
      ))}
      <AccountButton />
    </div>
  );
}

function AccountButton() {
  const {user} = useAuth();
  const hasUnreadNotif = !!user?.unread_notifications_count;
  const navigate = useNavigate();
  const {registration} = useSettings();

  const primaryArtist = usePrimaryArtistForCurrentUser();
  const {player} = useSettings();
  const menuItems = useMemo(() => {
    if (primaryArtist) {
      return [
        <MenuItem
          value="author"
          key="author"
          startIcon={<MicIcon />}
          onSelected={() => {
            navigate(getArtistLink(primaryArtist));
          }}
        >
          <Trans message="Artist profile" />
        </MenuItem>,
      ];
    }
    if (player?.show_become_artist_btn) {
      return [
        <MenuItem
          value="author"
          key="author"
          startIcon={<MicIcon />}
          onSelected={() => {
            navigate('/backstage/requests');
          }}
        >
          <Trans message="Become an author" />
        </MenuItem>,
      ];
    }

    return [];
  }, [primaryArtist, navigate, player?.show_become_artist_btn]);

  const button = (
    <button className="relative text-xs">
      <PersonIcon size="md" />
      {hasUnreadNotif ? (
        <Badge className="-top-6" right="right-4">
          {user?.unread_notifications_count}
        </Badge>
      ) : null}
      <div className="text-xs">
        <Trans message="Account" />
      </div>
    </button>
  );

  if (!user) {
    return (
      <MenuTrigger>
        {button}
        <Menu>
          <Item value="login" onSelected={() => navigate('/login')}>
            <Trans message="Login" />
          </Item>
          {!registration?.disable && (
            <Item value="register" onSelected={() => navigate('/register')}>
              <Trans message="Register" />
            </Item>
          )}
        </Menu>
      </MenuTrigger>
    );
  }

  return <NavbarAuthMenu items={menuItems}>{button}</NavbarAuthMenu>;
}
