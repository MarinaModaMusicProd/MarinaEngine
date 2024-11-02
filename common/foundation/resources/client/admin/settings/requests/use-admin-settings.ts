import {queryOptions, useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {AdminSettings} from '../admin-settings';
import {apiClient} from '@common/http/query-client';

export interface FetchAdminSettingsResponse
  extends BackendResponse,
    AdminSettings {}

export function useAdminSettings() {
  return useQuery(adminSettingsQueryOptions);
}

export const adminSettingsQueryOptions = queryOptions({
  queryKey: ['fetchAdminSettings'],
  queryFn: () => fetchAdminSettings(),
  staleTime: Infinity,
  select: prepareSettingsForHookForm,
});

function fetchAdminSettings() {
  return apiClient
    .get<FetchAdminSettingsResponse>('settings')
    .then(r => r.data);
}

// need to cast all numbers to strings and null/undefined to empty string recursively, otherwise hook form isDirty functionality will not work properly when binding numbers to text fields due to string/number type mismatch
export function prepareSettingsForHookForm(obj: any) {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(prepareSettingsForHookForm);
    } else if (typeof obj[key] === 'object') {
      obj[key] = prepareSettingsForHookForm(obj[key]);
    } else if (typeof obj[key] === 'number') {
      obj[key] = obj[key].toString();
    } else if (obj[key] == null) {
      obj[key] = '';
    }
  }
  return obj;
}
