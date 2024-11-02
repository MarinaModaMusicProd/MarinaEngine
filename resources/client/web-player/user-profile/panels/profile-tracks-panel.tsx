import {useUserLikedTracks} from '@app/web-player/library/requests/use-user-liked-tracks';
import {FullPageLoader} from '@ui/progress/full-page-loader';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {AudiotrackIcon} from '@ui/icons/material/Audiotrack';
import {Trans} from '@ui/i18n/trans';
import React from 'react';
import {ProfileContentProps} from '@app/web-player/user-profile/user-profile-page';
import {TrackList} from '@app/web-player/tracks/track-list/track-list';

export function ProfileTracksPanel({user}: ProfileContentProps) {
  const query = useUserLikedTracks(user.id);

  if (query.isLoading) {
    return <FullPageLoader className="min-h-100" screen={false} />;
  }

  if (!query.items.length) {
    return (
      <IllustratedMessage
        imageHeight="h-auto"
        imageMargin="mb-14"
        image={<AudiotrackIcon size="lg" className="text-muted" />}
        title={<Trans message="No tracks yet" />}
        description={
          <Trans
            message="Follow :user for updates on tracks they like in the future."
            values={{user: user.name}}
          />
        }
      />
    );
  }

  return <TrackList query={query} />;
}
