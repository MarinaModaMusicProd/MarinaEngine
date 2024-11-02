import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {NormalizedModel} from '@ui/types/normalized-model';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';

interface Response extends BackendResponse {
  results: NormalizedModel[];
}

interface Params {
  query?: string;
  perPage?: number;
  with?: string;
}

export function useNormalizedModels(
  endpoint: string,
  queryParams?: Params,
  queryOptions?: Omit<
    UseQueryOptions<Response, unknown, Response, any[]>,
    'queryKey' | 'queryFn'
  > | null,
) {
  return useQuery({
    queryKey: [...endpoint.split('/'), queryParams],
    queryFn: () => fetchModels(endpoint, queryParams),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
}

async function fetchModels(endpoint: string, params?: Params) {
  return apiClient.get<Response>(endpoint, {params}).then(r => {
    if ('results' in r.data) {
      return r.data;
    } else {
      const results = Object.values(r.data).find(v => Array.isArray(v));
      return {results} as Response;
    }
  });
}
