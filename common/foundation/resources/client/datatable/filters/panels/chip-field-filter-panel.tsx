import {Item} from '@ui/forms/listbox/item';
import {FilterPanelProps} from '@common/datatable/filters/panels/filter-panel-props';
import {FormChipField} from '@ui/forms/input-field/chip-field/form-chip-field';
import {useTrans} from '@ui/i18n/use-trans';
import {FilterChipFieldControl} from '@common/datatable/filters/backend-filter';
import {Trans} from '@ui/i18n/trans';

export function ChipFieldFilterPanel({
  filter,
}: FilterPanelProps<FilterChipFieldControl>) {
  const {trans} = useTrans();
  return (
    <FormChipField
      size="sm"
      name={`${filter.key}.value`}
      valueKey="id"
      allowCustomValue={false}
      showDropdownArrow
      placeholder={
        filter.control.placeholder
          ? trans(filter.control.placeholder)
          : undefined
      }
      displayWith={chip => {
        const o = filter.control.options.find(o => o.key === chip.id);
        if (!o) return undefined;
        return typeof o.label === 'string' ? o.label : o.label.message;
      }}
      suggestions={filter.control.options.map(o => ({
        id: o.key,
        name: typeof o.label === 'string' ? o.label : o.label.message,
      }))}
    >
      {chip => (
        <Item key={chip.id} value={chip.id}>
          {<Trans message={chip.name} />}
        </Item>
      )}
    </FormChipField>
  );
}
