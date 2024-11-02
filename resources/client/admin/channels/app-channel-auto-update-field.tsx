import {useSettings} from '@ui/settings/use-settings';
import {useMemo} from 'react';
import {message} from '@ui/i18n/message';
import {ChannelAutoUpdateField} from '@common/admin/channels/channel-editor/controls/channel-auto-update-field';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';

interface Props {
  className?: string;
  config: ChannelContentConfig;
}
export function AppChannelAutoUpdateField({className, config}: Props) {
  const {spotify_is_setup, lastfm_is_setup} = useSettings();

  const providers = useMemo(() => {
    const providers = [{label: message('Local database'), value: 'local'}];
    if (spotify_is_setup) {
      providers.push({label: message('Spotify'), value: 'spotify'});
    }
    if (lastfm_is_setup) {
      providers.push({label: message('Last.fm'), value: 'lastfm'});
    }
    return providers;
  }, [spotify_is_setup, lastfm_is_setup]);

  return (
    <ChannelAutoUpdateField
      config={config}
      providers={providers}
      className={className}
    />
  );
}
