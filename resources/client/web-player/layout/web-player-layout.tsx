import {Outlet} from 'react-router-dom';
import {PlayerContext} from '@common/player/player-context';
import {playerStoreOptions} from '@app/web-player/state/player-store-options';
import React, {Fragment} from 'react';
import {useSettings} from '@ui/settings/use-settings';
import {Sidenav} from '@app/web-player/layout/sidenav';
import {QueueSidenav} from '@app/web-player/layout/queue/queue-sidenav';
import clsx from 'clsx';
import {useMediaQuery} from '@ui/utils/hooks/use-media-query';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {MobilePlayerControls} from '@app/web-player/player-controls/mobile-player-controls';
import {DesktopPlayerControls} from '@app/web-player/player-controls/desktop-player-controls';
import {PlayerOverlay} from '@app/web-player/overlay/player-overlay';
import {PlayerNavbar} from '@app/web-player/layout/player-navbar';
import {DashboardLayout} from '@common/ui/dashboard-layout/dashboard-layout';
import {DashboardSidenav} from '@common/ui/dashboard-layout/dashboard-sidenav';
import {DashboardContent} from '@common/ui/dashboard-layout/dashboard-content';
import {useIsTabletMediaQuery} from '@ui/utils/hooks/is-tablet-media-query';

export function WebPlayerLayout() {
  const {player} = useSettings();
  const isMobile = useIsTabletMediaQuery();

  const content = isMobile ? (
    <Fragment>
      <Main className="h-screen" />
      <MobilePlayerControls />
    </Fragment>
  ) : (
    <DashboardLayout
      name="web-player"
      initialRightSidenavStatus={player?.hide_queue ? 'closed' : 'open'}
    >
      <PlayerNavbar />
      <DashboardSidenav position="left" display="block">
        <Sidenav />
      </DashboardSidenav>
      <DashboardContent>
        <Main />
      </DashboardContent>
      <RightSidenav />
      <DesktopPlayerControls />
    </DashboardLayout>
  );

  return (
    <PlayerContext id="web-player" options={playerStoreOptions}>
      {content}
      <PlayerOverlay />
    </PlayerContext>
  );
}

interface MainProps {
  className?: string;
}
function Main({className}: MainProps) {
  return (
    <main
      className={clsx(
        'relative overflow-x-hidden stable-scrollbar',
        className,
        // mobile player controls are fixed to bottom of screen,
        // make sure we can scroll to the bottom of the page
        'pb-124 md:pb-0',
      )}
    >
      <div className="web-player-container mx-auto min-h-full p-16 @container md:p-30">
        <Outlet />
      </div>
    </main>
  );
}

function RightSidenav() {
  const isOverlay = useMediaQuery('(max-width: 1280px)');
  const hideQueue = usePlayerStore(s => !s.shuffledQueue.length);
  return (
    <DashboardSidenav
      position="right"
      size="w-256"
      mode={isOverlay ? 'overlay' : undefined}
      overlayPosition="absolute"
      display="block"
      forceClosed={hideQueue}
    >
      <QueueSidenav />
    </DashboardSidenav>
  );
}
