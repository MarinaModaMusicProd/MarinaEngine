import {apiClient} from '@common/http/query-client';
import {Chat} from '@livechat/widget/chat/chat';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';
import {BackendFiltersUrlKey} from '@common/datatable/filters/backend-filters-url-key';
import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';

interface Params {
  order?: string;
  query?: string | null;
  [BackendFiltersUrlKey]?: string | null;
}

export function useArchivedChats(params?: Params) {
  return useInfiniteData<Chat>({
    queryKey: ['chats', 'archived', params],
    preserveQueryKey: true,
    endpoint: 'lc/dashboard/archived-chats',
    willSortOrFilter: true,
    paginate: 'simple',
    queryParams: params as any,
  });
}

function fetchChats(params?: Params) {
  return apiClient
    .get<PaginatedBackendResponse<Chat>>('lc/dashboard/archived-chats', {
      params,
    })
    .then(response => response.data);
}
