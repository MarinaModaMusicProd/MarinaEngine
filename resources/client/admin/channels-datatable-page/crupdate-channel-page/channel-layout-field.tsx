import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';

export function ChannelLayoutField() {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const contentModel = watch('config.contentModel');

  if (contentModel !== 'track') {
    return null;
  }

  return (
    <FormSelect
      className="my-24"
      selectionMode="single"
      name="config.layout"
      label={<Trans message="Layout" />}
    >
      <Option value="grid">
        <Trans message="Grid" />
      </Option>
      <Option value="trackTable" isDisabled={contentModel !== 'track'}>
        <Trans message="Track table" />
      </Option>
      <Option value="trackList" isDisabled={contentModel !== 'track'}>
        <Trans message="Track list" />
      </Option>
    </FormSelect>
  );
}
