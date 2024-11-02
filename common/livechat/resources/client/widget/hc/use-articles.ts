import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import type {UseArticlesResponse} from '@helpdesk/help-center/articles/requests/use-articles';

interface Params {
  query?: string;
  perPage?: number;
}

export function useArticles(params: Params) {
  return useQuery({
    queryKey: ['articles', 'widget', params],
    queryFn: ({signal}) => fetchArticles(params, signal),
    placeholderData: params.query ? keepPreviousData : undefined,
  });
}

async function fetchArticles(params: Params, signal?: AbortSignal) {
  if (params.query) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return apiClient
    .get<UseArticlesResponse>(`hc/articles`, {
      signal: params.query ? signal : undefined,
      params: {
        ...params,
        with: 'path',
        paginate: 'simple',
        defaultOrder: 'views|desc',
      },
    })
    .then(response => response.data);
}
