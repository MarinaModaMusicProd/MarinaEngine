import {DynamicHomepage} from '@common/ui/other/dynamic-homepage';
import {LandingPage} from '@app/landing-page/landing-page';
import React from 'react';
import {useSettings} from '@ui/settings/use-settings';
import {useAuth} from '@common/auth/use-auth';
import {WebPlayerLayout} from '@app/web-player/layout/web-player-layout';
import {useMatches} from 'react-router-dom';
import {AuthRoute} from '@common/auth/guards/auth-route';

export function Homepage() {
  const {homepage} = useSettings();
  const {user} = useAuth();
  const matches = useMatches();
  const type = homepage?.type ?? '';

  // if user is logged in or homepage is a channel, fallthrough to web player routing
  if (
    type.startsWith('channel') ||
    (type.startsWith('landing') && user) ||
    ((type.startsWith('login') || type.startsWith('register')) && user) ||
    matches.at(-1)?.id !== 'webPlayerIndex'
  ) {
    return (
      <AuthRoute requireLogin={false} permission="music.view">
        <WebPlayerLayout />
      </AuthRoute>
    );
  }

  return <DynamicHomepage homepageResolver={() => <LandingPage />} />;
}
