import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Group} from '@helpdesk/groups/group';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';

interface Response extends PaginatedBackendResponse<Group> {}

export function useGroups() {
  return useQuery({
    queryKey: ['helpdesk', 'groups', 'all'],
    queryFn: () => fetchGroups(),
  });
}

function fetchGroups() {
  return apiClient
    .get<Response>('helpdesk/groups', {
      params: {paginate: 'simple', perPage: 20},
    })
    .then(response => response.data);
}
