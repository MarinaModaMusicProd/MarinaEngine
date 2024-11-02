import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {Role} from '@common/auth/role';

export interface AgentRolesResponse extends BackendResponse {
  roles: Role[];
  defaultRoleId: number;
}

interface Params {
  query?: string;
}
export function useAvailableAgentRoles(params?: Params) {
  return useQuery({
    queryKey: ['users', 'agents', 'roles', params],
    queryFn: () => fetchRoles(params),
  });
}

function fetchRoles(params?: Params) {
  return apiClient
    .get<AgentRolesResponse>('helpdesk/autocomplete/roles', {params})
    .then(response => response.data);
}
