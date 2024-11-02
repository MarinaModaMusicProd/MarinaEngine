import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {CompactUser} from '@ui/types/user';

export interface CompactLivechatAgent extends CompactUser {
  acceptsChats: boolean;
  activeAssignedChatsCount: number;
  groups: {id: number; name: string}[];
}

interface Response {
  agents: CompactLivechatAgent[];
}

export function useAllDashboardAgents() {
  return useQuery({
    queryKey: ['helpdesk', 'agents', 'all'],
    queryFn: () => fetchCompactLivechatAgents(),
  });
}

export function fetchCompactLivechatAgents() {
  return apiClient
    .get<Response>('lc/compact-agents')
    .then(response => response.data);
}
