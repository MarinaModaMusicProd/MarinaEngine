import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {AppearanceDefaults, AppearanceEditorValues} from '../appearance-store';
import {prepareSettingsForHookForm} from '@common/admin/settings/requests/use-admin-settings';

export interface FetchAppearanceValuesResponse extends BackendResponse {
  values: AppearanceEditorValues;
  defaults: AppearanceDefaults;
}

export function useAppearanceEditorValuesQuery() {
  return useQuery({
    queryKey: ['admin/appearance/values'],
    queryFn: () => fetchAppearanceValues(),
    staleTime: Infinity,
    select: prepareSettingsForHookForm,
  });
}

export function useAppearanceEditorValues(): AppearanceEditorValues {
  const {data} = useAppearanceEditorValuesQuery();
  return data!.values;
}

function fetchAppearanceValues(): Promise<FetchAppearanceValuesResponse> {
  return apiClient.get('admin/appearance/values').then(r => r.data);
}
