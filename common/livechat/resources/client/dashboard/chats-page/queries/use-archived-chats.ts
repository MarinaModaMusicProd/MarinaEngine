import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Chat} from '@livechat/widget/chat/chat';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';
import {BackendFiltersUrlKey} from '@common/datatable/filters/backend-filters-url-key';

interface Params {
  order?: string;
  query?: string | null;
  [BackendFiltersUrlKey]?: string | null;
}

export function useArchivedChats(params?: Params) {
  return useQuery({
    queryKey: ['dashboard', 'chats', 'archived', params],
    queryFn: () => fetchChats(params),
    placeholderData:
      params?.query || params?.[BackendFiltersUrlKey] || params?.order
        ? keepPreviousData
        : undefined,
  });
}

function fetchChats(params?: Params) {
  return apiClient
    .get<PaginatedBackendResponse<Chat>>('lc/dashboard/archived-chats', {
      params,
    })
    .then(response => response.data);
}
