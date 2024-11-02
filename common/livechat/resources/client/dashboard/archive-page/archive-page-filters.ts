import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '@common/datatable/filters/backend-filter';
import {message} from '@ui/i18n/message';
import {
  createdAtFilter,
  timestampFilter,
} from '@common/datatable/filters/timestamp-filters';
import {useTags} from '@common/tags/use-tags';
import {useMemo} from 'react';
import {useValueLists} from '@common/http/value-lists';

export function useArchivePageFilters(): BackendFilter[] {
  const tags = useTags({});
  const values = useValueLists(['countries']);

  return useMemo(() => {
    if (!tags.data || !values.data) return [];
    return [
      createdAtFilter({
        description: message('Date chat was started'),
      }),
      timestampFilter({
        key: 'closed_at',
        label: message('Closed at'),
        description: message('Date chat was closed'),
      }),
      {
        key: 'tags',
        label: message('Tags'),
        description: message('Tags attached to chat'),
        defaultOperator: FilterOperator.has,
        control: {
          type: FilterControlType.ChipField,
          placeholder: message('Find tag'),
          defaultValue: [],
          options: tags.data.pagination.data.map(tag => ({
            key: tag.id,
            label: message(tag.display_name || tag.name),
            value: tag.id,
          })),
        },
      },
      {
        key: 'assigned_to',
        label: message('Assignee'),
        description: message('Agent assigned to the chat'),
        defaultOperator: FilterOperator.eq,
        control: {
          type: FilterControlType.SelectModel,
          model: 'user',
          endpoint: 'helpdesk/normalized-models/agent',
        },
      },
      {
        key: 'group_id',
        label: message('Group'),
        description: message('Group chat is assigned to'),
        defaultOperator: FilterOperator.eq,
        control: {
          type: FilterControlType.SelectModel,
          model: 'group',
        },
      },
      {
        key: 'country',
        label: message('Country'),
        description: message('Country for the user who started the chat'),
        defaultOperator: FilterOperator.eq,
        control: {
          type: FilterControlType.Select,
          showSearchField: true,
          searchPlaceholder: message('Search for country'),
          defaultValue: 'us',
          options: values.data.countries!.map(country => ({
            key: country.code,
            label: message(country.name),
            value: country.code,
          })),
        },
      },
    ];
  }, [tags, values]);
}
