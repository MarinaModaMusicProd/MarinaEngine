import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {ARTIST_MODEL} from '@app/web-player/artists/artist';
import {ALBUM_MODEL} from '@app/web-player/albums/album';
import {TRACK_MODEL} from '@app/web-player/tracks/track';
import {PLAYLIST_MODEL} from '@app/web-player/playlists/playlist';
import {GENRE_MODEL} from '@app/web-player/genres/genre';
import {USER_MODEL} from '@common/auth/user';
import {CHANNEL_MODEL} from '@app/web-player/channels/channel';

export function ChannelContentModelField() {
  const {watch, setValue} = useFormContext<UpdateChannelPayload>();
  const isTypeManual = watch('config.contentType') === 'manual';
  const isAutoUpdating = watch('config.contentType') === 'autoUpdate';
  return (
    <FormSelect
      disabled={isAutoUpdating}
      className="my-24"
      selectionMode="single"
      name="config.contentModel"
      label={<Trans message="Type of content" />}
      onSelectionChange={newValue => {
        if (newValue === 'channel') {
          setValue('config.contentOrder', 'channelables.order:asc');
        } else {
          setValue('config.contentOrder', 'created_at:desc');
        }
        if (newValue === 'track') {
          setValue('config.layout', 'trackTable');
        } else {
          setValue('config.layout', 'grid');
        }
      }}
    >
      <Option value={ARTIST_MODEL}>
        <Trans message="Artist" />
      </Option>
      <Option value={ALBUM_MODEL}>
        <Trans message="Album" />
      </Option>
      <Option value={TRACK_MODEL}>
        <Trans message="Track" />
      </Option>
      <Option value={PLAYLIST_MODEL}>
        <Trans message="Playlist" />
      </Option>
      <Option value={GENRE_MODEL}>
        <Trans message="Genre" />
      </Option>
      <Option value={USER_MODEL}>
        <Trans message="User" />
      </Option>
      {isTypeManual && (
        <Option value={CHANNEL_MODEL}>
          <Trans message="Channel" />
        </Option>
      )}
    </FormSelect>
  );
}
