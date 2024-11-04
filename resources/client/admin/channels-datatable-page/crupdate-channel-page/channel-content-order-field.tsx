import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@common/ui/buttons/external-link';
import {USER_MODEL} from '@common/auth/user';
import {CHANNEL_MODEL} from '@app/web-player/channels/channel';
import {ALBUM_MODEL} from '@app/web-player/albums/album';

export function ChannelContentOrderField() {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const contentModel = watch('config.contentModel');
  const contentType = watch('config.contentType');
  const orderIsPopularity = watch('config.contentOrder') === 'popularity:desc';
  return (
    <FormSelect
      className="my-24"
      selectionMode="single"
      name="config.contentOrder"
      label={<Trans message="How to order content" />}
      description={
        orderIsPopularity ? (
          <Trans
            message="Sorting will be based on 'Sort Method' option in <a>Settings page</a>."
            values={{
              a: parts => (
                <Link
                  className={LinkStyle}
                  target="_blank"
                  to="/admin/settings/player"
                >
                  {parts}
                </Link>
              ),
            }}
          />
        ) : null
      }
    >
      <Option
        value="popularity:desc"
        isDisabled={
          contentModel === USER_MODEL || contentModel === CHANNEL_MODEL
        }
      >
        <Trans message="Most popular first" />
      </Option>
      <Option value="created_at:desc">
        <Trans message="Most recently added first" />
      </Option>
      <Option
        value="release_date:desc"
        isDisabled={contentModel !== ALBUM_MODEL}
      >
        <Trans message="Most recent first (by release date)" />
      </Option>
      <Option
        value="channelables.order:asc"
        isDisabled={contentType !== 'manual'}
      >
        <Trans message="Manual (reorder below)" />
      </Option>
    </FormSelect>
  );
}
