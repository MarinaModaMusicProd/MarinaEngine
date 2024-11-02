import {message} from '@ui/i18n/message';
import {createdAtFilter} from '@common/datatable/filters/timestamp-filters';
import {
  ALL_NUMBER_OPERATORS,
  ALL_STRING_OPERATORS,
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '@common/datatable/filters/backend-filter';
import {FetchValueListsResponse, useValueLists} from '@common/http/value-lists';

export function useVisitorIndexPageFilters() {
  const {data, isLoading} = useValueLists(['countries']);

  const filters = data ? getVisitorIndexPageFilters(data) : [];

  return {filters, isFiltersLoading: isLoading};
}

function getVisitorIndexPageFilters(
  data: FetchValueListsResponse,
): BackendFilter[] {
  return [
    {
      key: 'status',
      label: message('Status'),
      description: message("Status for visitor's latest chat"),
      defaultOperator: FilterOperator.eq,
      control: {
        type: FilterControlType.Select,
        options: [
          {key: 'active', value: 'active', label: message('Active')},
          {key: 'pending', value: 'pending', label: message('Pending')},
          {key: 'queued', value: 'queued', label: message('Queued')},
          {
            key: 'unassigned',
            value: 'unassigned',
            label: message('Unassigned'),
          },
          {key: 'closed', value: 'closed', label: message('Closed')},
        ],
      },
    },
    {
      key: 'assigned_to',
      label: message('Assigned to'),
      description: message("Agent visitor's latest chat is assigned to"),
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
      description: message("Group visitor's latest chat belongs to"),
      defaultOperator: FilterOperator.eq,
      control: {
        type: FilterControlType.SelectModel,
        model: 'group',
      },
    },
    {
      key: 'country',
      label: message('Country'),
      description: message("Visitor's country"),
      defaultOperator: FilterOperator.eq,
      control: {
        type: FilterControlType.Select,
        options: (data.countries ?? []).map(c => ({
          key: c.code,
          value: c.code,
          label: c.name,
        })),
      },
    },
    {
      key: 'city',
      label: message('City'),
      description: message("Visitor's city"),
      defaultOperator: FilterOperator.eq,
      operators: ALL_STRING_OPERATORS,
      control: {
        type: FilterControlType.Input,
        inputType: 'string',
        defaultValue: '',
      },
    },
    {
      key: 'state',
      label: message('State'),
      description: message("Visitor's state"),
      defaultOperator: FilterOperator.eq,
      operators: ALL_STRING_OPERATORS,
      control: {
        type: FilterControlType.Input,
        inputType: 'string',
        defaultValue: '',
      },
    },
    {
      key: 'user_ip',
      label: message('IP address'),
      description: message("Visitor's IP address"),
      defaultOperator: FilterOperator.eq,
      control: {
        type: FilterControlType.Input,
        inputType: 'string',
        defaultValue: '',
      },
    },
    {
      key: 'visits_count',
      label: message('Number of visits'),
      description: message('Total number of visits'),
      defaultOperator: FilterOperator.gte,
      operators: ALL_NUMBER_OPERATORS,
      control: {
        type: FilterControlType.Input,
        inputType: 'number',
        defaultValue: 5,
      },
    },
    {
      key: 'is_returning',
      label: message('Returning visitor'),
      description: message('Whether visitor has visited before'),
      defaultOperator: FilterOperator.eq,
      control: {
        type: FilterControlType.BooleanToggle,
        defaultValue: true,
      },
    },
    {
      key: 'referrer',
      label: message('Came from'),
      description: message('Previous page visitor came from'),
      defaultOperator: FilterOperator.eq,
      operators: ALL_STRING_OPERATORS,
      control: {
        type: FilterControlType.Input,
        inputType: 'string',
        defaultValue: '',
      },
    },
    createdAtFilter({
      description: message('First visit date'),
    }),
  ];
}
