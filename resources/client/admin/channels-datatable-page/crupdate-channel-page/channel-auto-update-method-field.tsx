import {useSettings} from '@common/core/settings/use-settings';
import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {InfoDialogTrigger} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {Fragment} from 'react';
import {LearnMoreLink} from '@common/admin/settings/learn-more-link';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';

export function ChannelAutoUpdateMethodField() {
  const {spotify_is_setup, lastfm_is_setup} = useSettings();
  const {watch, setValue} = useFormContext<UpdateChannelPayload>();

  if (watch('config.contentType') !== 'autoUpdate') {
    return null;
  }

  return (
    <div className="md:flex items-end my-24 gap-14">
      <FormSelect
        className="flex-auto"
        selectionMode="single"
        name="config.autoUpdateMethod"
        label={
          <Fragment>
            <Trans message="Auto update method" />
            <InfoDialogTrigger
              body={
                <Fragment>
                  <div className="mb-20">
                    <Trans message="This option will update channel content every 24 hours from the selected 3rd party source." />
                  </div>
                  <LearnMoreLink link="https://support.vebto.com/help-center/articles/28/31/170/channels" />
                </Fragment>
              }
            />
          </Fragment>
        }
        required
        onSelectionChange={newValue => {
          // set content model to correct value when changing auto update method
          if (
            newValue === 'spotifyTopTracks' ||
            newValue === 'spotifyPlaylistTracks'
          ) {
            setValue('config.contentModel', 'track');
          } else if (newValue === 'spotifyNewAlbums') {
            setValue('config.contentModel', 'album');
          } else if (newValue === 'lastfmTopGenres') {
            setValue('config.contentModel', 'genre');
          }
        }}
      >
        {spotify_is_setup && (
          <Option value="spotifyTopTracks">
            <Trans message="Spotify: top tracks" />
          </Option>
        )}
        {spotify_is_setup && (
          <Option value="spotifyNewAlbums">
            <Trans message="Spotify: new releases" />
          </Option>
        )}
        {spotify_is_setup && (
          <Option value="spotifyPlaylistTracks">
            <Trans message="Spotify: playlist tracks" />
          </Option>
        )}
        {lastfm_is_setup && (
          <Option value="lastfmTopGenres">
            <Trans message="Last.fm: popular genres" />
          </Option>
        )}
      </FormSelect>
      {watch('config.autoUpdateMethod') === 'spotifyPlaylistTracks' && (
        <FormTextField
          className="flex-auto mt-24 md:mt-0"
          name="config.autoUpdateValue"
          label={<Trans message="Playlist ID" />}
        />
      )}
    </div>
  );
}
