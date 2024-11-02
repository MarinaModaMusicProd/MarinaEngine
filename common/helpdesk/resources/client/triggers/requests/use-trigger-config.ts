import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';

interface ConditionTextInputConfig {
  type: 'text';
  input_type?: 'text' | 'number';
}

interface ConditionSelectInputConfig {
  type: 'select';
  select_options:
    | SelectOptions
    | {name: string; value: string; image?: string; description?: string}[];
}

export type TriggerConditionInputConfig =
  | ConditionTextInputConfig
  | ConditionSelectInputConfig;

export interface ConditionConfig {
  label: string;
  group: string;
  operators: string[];
  time_based?: boolean;
  input_config: TriggerConditionInputConfig;
}

export interface ActionConfig {
  label: string;
  input_config?: {
    inputs: TriggerActionInputConfig[];
  };
}

type SelectOptions = 'conversation:status' | 'agent:id' | 'ticket:category';

interface TriggerActionTextInputConfig {
  name: string;
  display_name: string;
  type: 'textarea' | 'text';
  placeholder?: string;
  default_value?: string | number;
}

interface TriggerActionSelectInputConfig
  extends Omit<TriggerActionTextInputConfig, 'type'> {
  type: 'select';
  select_options: SelectOptions;
}

export type TriggerActionInputConfig =
  | TriggerActionTextInputConfig
  | TriggerActionSelectInputConfig;

export interface FetchTriggerConfigResponse extends BackendResponse {
  actions: Record<
    string,
    {
      label: string;
      input_config?: {
        inputs: TriggerActionInputConfig[];
      };
    }
  >;
  conditions: Record<string, ConditionConfig>;
  groupedConditions: Record<string, Record<string, ConditionConfig>>;
  operators: Record<
    string,
    {
      label: string;
      type: string;
    }
  >;
  selectOptions: Record<
    SelectOptions,
    {name: string; value: string; description?: string; image?: string}[]
  >;
}

export function useTriggerConfig() {
  return useQuery({
    queryKey: ['triggers', `config`],
    queryFn: () => fetchConfig(),
  });
}

async function fetchConfig() {
  const data = await apiClient
    .get<FetchTriggerConfigResponse>(`triggers/config`)
    .then(response => response.data);

  const groupedConditions: FetchTriggerConfigResponse['groupedConditions'] = {};

  for (const [name, condition] of Object.entries(data.conditions)) {
    if (!groupedConditions[condition.group]) {
      groupedConditions[condition.group] = {};
    }
    groupedConditions[condition.group][name] = condition;
  }

  return {...data, groupedConditions};
}
