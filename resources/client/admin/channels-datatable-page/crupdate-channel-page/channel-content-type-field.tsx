import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {ARTIST_MODEL} from '@app/web-player/artists/artist';
import {TRACK_MODEL} from '@app/web-player/tracks/track';

export function ChannelContentTypeField() {
  const {setValue} = useFormContext<UpdateChannelPayload>();
  return (
    <FormSelect
      className="my-24"
      selectionMode="single"
      name="config.contentType"
      label={<Trans message="Content" />}
      onSelectionChange={newValue => {
        if (newValue !== 'autoUpdate') {
          setValue('config.autoUpdateMethod', '');
        } else {
          setValue('config.autoUpdateMethod', 'spotifyTopTracks');
          setValue('config.contentModel', TRACK_MODEL);
          setValue('config.connectToGenreViaUrl', false);
        }
        if (newValue === 'listAll') {
          setValue('config.contentModel', ARTIST_MODEL);
        }
      }}
    >
      <Option value="listAll">
        <Trans message="List all content of specified type" />
      </Option>
      <Option value="manual">
        <Trans message="Add content manually" />
      </Option>
      <Option value="autoUpdate">
        <Trans message="Automatically update content with specified method" />
      </Option>
    </FormSelect>
  );
}
