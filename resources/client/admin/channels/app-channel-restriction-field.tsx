import {useTrans} from '@ui/i18n/use-trans';
import React, {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {useValueLists} from '@common/http/value-lists';
import {FormSelect} from '@ui/forms/select/select';
import {message} from '@ui/i18n/message';
import {Trans} from '@ui/i18n/trans';
import {Item} from '@ui/forms/listbox/item';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';
import {ChannelRestrictionField} from '@common/admin/channels/channel-editor/controls/channel-restriction-field';
import {GENRE_MODEL} from '@app/web-player/genres/genre';

interface Props {
  className?: string;
  config: ChannelContentConfig;
}
export function AppChannelRestrictionField({className, config}: Props) {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const contentType = watch('config.contentType');

  if (contentType !== 'listAll') return null;

  return (
    <ChannelRestrictionField config={config} className={className}>
      <RestrictionModelField config={config} />
    </ChannelRestrictionField>
  );
}

interface RestrictionModelFieldProps {
  config: ChannelContentConfig;
}
function RestrictionModelField({config}: RestrictionModelFieldProps) {
  const {trans} = useTrans();
  const [searchValue, setSearchValue] = useState('');
  const {watch} = useFormContext<UpdateChannelPayload>();
  const selectedId = watch('config.restrictionModelId');
  const query = useValueLists(['genres'], {
    searchQuery: searchValue,
    selectedValue: selectedId,
    type: watch('config.autoUpdateProvider'),
  });

  const selectedRestriction = watch(
    'config.restriction',
  ) as keyof typeof config.restrictions;

  if (!selectedRestriction) return null;

  const options = {
    [GENRE_MODEL]: query.data?.genres,
  } as Record<string, {value: string; name: string}[]>;
  const restrictionLabel = config.restrictions[selectedRestriction].label;

  // allow setting keyword to custom value, because there are too many keywords
  // to put into autocomplete, ideally it would use async search from backend though

  return (
    <FormSelect
      className="w-full flex-auto"
      name="config.restrictionModelId"
      selectionMode="single"
      showSearchField
      searchPlaceholder={trans(message('Search...'))}
      isAsync={selectedRestriction === 'genre'}
      isLoading={selectedRestriction === 'genre' && query.isLoading}
      inputValue={searchValue}
      onInputValueChange={setSearchValue}
      label={
        <Trans
          message=":restriction name"
          values={{restriction: trans(restrictionLabel)}}
        />
      }
    >
      <Item value="urlParam">
        <Trans message="Dynamic (from url)" />
      </Item>
      {options[selectedRestriction]?.map(option => (
        <Item key={option.value} value={option.value}>
          <Trans message={option.name} />
        </Item>
      ))}
    </FormSelect>
  );
}
