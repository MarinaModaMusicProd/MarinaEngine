import {FormChipField} from '@ui/forms/input-field/chip-field/form-chip-field';
import {Trans} from '@ui/i18n/trans';
import React, {useState} from 'react';
import {useArtistPickerSuggestions} from '@app/web-player/artists/artist-picker/use-artist-picker-suggestions';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {Item} from '@ui/forms/listbox/item';

interface FormArtistPickerProps {
  name: string;
  className?: string;
}
export function FormArtistPicker({name, className}: FormArtistPickerProps) {
  const {trans} = useTrans();
  const [inputValue, setInputValue] = useState('');
  const {data, isLoading} = useArtistPickerSuggestions({query: inputValue});

  return (
    <FormChipField
      className={className}
      name={name}
      label={<Trans message="Artists" />}
      isAsync
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      suggestions={data?.results}
      placeholder={trans(message('+Add artist'))}
      isLoading={isLoading}
      allowCustomValue={false}
    >
      {data?.results.map(result => (
        <Item
          value={result}
          key={result.id}
          startIcon={
            result.image ? (
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={result.image}
                alt=""
              />
            ) : undefined
          }
        >
          {result.name}
        </Item>
      ))}
    </FormChipField>
  );
}
