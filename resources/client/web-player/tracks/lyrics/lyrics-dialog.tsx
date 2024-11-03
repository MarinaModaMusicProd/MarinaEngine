import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {Track} from '@app/web-player/tracks/track';
import {TrackImage} from '@app/web-player/tracks/track-image/track-image';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {useLyrics} from '@app/web-player/tracks/lyrics/requests/use-lyrics';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {ArtistLinks} from '@app/web-player/artists/artist-links';
import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import {MediaMicrophoneIcon} from '@common/icons/media/media-microphone';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';

interface Props {
  track: Track;
}
export function LyricsDialog({track}: Props) {
  const {data, isLoading} = useLyrics(track);
  const {close} = useDialogContext();

  let content;

  if (data?.lyric?.text) {
    content = (
      <m.div
        className="text-lg w-full"
        key="lyrics"
        {...opacityAnimation}
        dangerouslySetInnerHTML={{__html: data?.lyric?.text || ''}}
      />
    );
  } else if (isLoading) {
    content = <LyricSkeleton />;
  } else {
    content = (
      <IllustratedMessage
        image={<MediaMicrophoneIcon size="xl" />}
        imageHeight="h-auto"
        title={<Trans message="We do not have lyrics for this song yet" />}
        description={<Trans message="Please try again later" />}
      />
    );
  }

  return (
    <Dialog size="fullscreenTakeover">
      <DialogHeader closeButtonSize="lg">
        <div className="sr-only">
          <Trans message="Lyrics" />
        </div>
      </DialogHeader>
      <DialogBody className="flex items-stretch gap-24 h-full" padding="p-0">
        <div className="hidden md:flex-[0.4_1_0%] md:flex items-center justify-end pl-40">
          <div>
            <TrackImage
              track={track}
              size="w-400 max-w-full aspect-square"
              className="flex-shrink-0 shadow-md rounded"
            />
            <div className="mt-14 text-center text-xl">{track.name}</div>
            <div className="mt-4 text-center text-base text-muted">
              <ArtistLinks
                artists={track.artists}
                onLinkClick={() => close()}
              />
            </div>
          </div>
        </div>
        <div className="flex-auto md:flex-[0.6_1_0%] stable-scrollbar overflow-y-auto text-center pl-14 pr-14 md:pl-0 md:pr-40 pb-40">
          <div className="flex items-center justify-center min-h-full w-full max-w-580 mx-auto">
            <AnimatePresence>{content}</AnimatePresence>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
}

function LyricSkeleton() {
  return (
    <m.div key="skeleton" {...opacityAnimation} className="w-full">
      {[...new Array(8).keys()].map(key => (
        <Skeleton key={key} variant="text" className="mb-20" />
      ))}
    </m.div>
  );
}
