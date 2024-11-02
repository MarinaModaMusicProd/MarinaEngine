import {FullPageLoader} from '@ui/progress/full-page-loader';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {Trans} from '@ui/i18n/trans';
import React from 'react';
import {ProfileContentProps} from '@app/web-player/user-profile/user-profile-page';
import {useUserLikedAlbums} from '@app/web-player/library/requests/use-user-liked-albums';
import {AlbumIcon} from '@ui/icons/material/Album';
import {AlbumList} from '@app/web-player/albums/album-list/album-list';

export function ProfileAlbumsPanel({user}: ProfileContentProps) {
  const query = useUserLikedAlbums(user.id, {
    queryParams: {
      with: 'tracks',
    },
  });

  if (query.isInitialLoading) {
    return <FullPageLoader className="min-h-100" />;
  }

  if (!query.items.length) {
    return (
      <IllustratedMessage
        imageHeight="h-auto"
        imageMargin="mb-14"
        image={<AlbumIcon size="lg" className="text-muted" />}
        title={<Trans message="No albums yet" />}
        description={
          <Trans
            message="Follow :user for updates on albums they like in the future."
            values={{user: user.name}}
          />
        }
      />
    );
  }

  return <AlbumList query={query} />;
}
