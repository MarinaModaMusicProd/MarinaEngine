import {Artist} from '@app/web-player/artists/artist';
import {ImageZoomDialog} from '@ui/overlays/dialog/image-zoom-dialog';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {useMemo} from 'react';
import {useLinkifiedString} from '@ui/utils/hooks/use-linkified-string';
import {ProfileLinks} from '@app/web-player/user-profile/profile-links';
import {useSettings} from '@ui/settings/use-settings';

interface ArtistAboutTabProps {
  artist: Artist;
}
export function ArtistAboutPanel({artist}: ArtistAboutTabProps) {
  const {artistPage} = useSettings();
  const description = useLinkifiedString(artist.profile?.description);

  const images = useMemo(() => {
    return artist.profile_images?.map(img => img.url) || [];
  }, [artist.profile_images]);

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-24 lg:grid-cols-4">
        {images.map((src, index) => (
          <DialogTrigger key={src} type="modal">
            <button
              type="button"
              className="cursor-zoom-in overflow-hidden rounded outline-none transition hover:scale-105 focus-visible:ring"
            >
              <img
                className="aspect-video cursor-zoom-in rounded object-cover shadow"
                src={src}
                alt=""
              />
            </button>
            <ImageZoomDialog images={images} defaultActiveIndex={index} />
          </DialogTrigger>
        ))}
      </div>
      <div
        className="whitespace-pre-wrap py-24 text-sm"
        dangerouslySetInnerHTML={{__html: description || ''}}
      />
      {artist.links?.length && !artistPage?.showDescription && (
        <ProfileLinks links={artist.links} />
      )}
    </div>
  );
}
