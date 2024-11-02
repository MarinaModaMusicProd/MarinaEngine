import {IllustratedMessage} from '@ui/images/illustrated-message';
import {AlbumIcon} from '@ui/icons/material/Album';
import {Trans} from '@ui/i18n/trans';

export function NoDiscographyMessage() {
  return (
    <IllustratedMessage
      className="my-80"
      imageHeight="h-auto"
      image={<AlbumIcon size="xl" className="text-muted" />}
      title={<Trans message="We do not have discography for this artist yet" />}
    />
  );
}
