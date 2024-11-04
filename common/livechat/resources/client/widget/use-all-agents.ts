import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {getWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';
import {CompactUser} from '@ui/types/user';
import {useOnlineAgentIds} from '@livechat/dashboard/agents/use-is-agent-online';

export interface WidgetAgent extends CompactUser {
  acceptsChats: boolean;
}

interface Response {
  agents: WidgetAgent[];
}

export function useAllAgents() {
  const {data} = useAllAgentsQuery();
  return data?.agents || [];
}

export function useAllAgentsQuery() {
  return useQuery({
    queryKey: ['widget', 'agents', 'all'],
    queryFn: () => fetchAgents(),
    initialData: () => {
      return {agents: getWidgetBootstrapData().agents};
    },
  });
}

export function useAgentsAcceptingChats() {
  const agents = useAllAgents();
  const onlineAgentIds = useOnlineAgentIds();
  return agents.filter(agent => {
    return agent.acceptsChats && onlineAgentIds.includes(agent.id);
  });
}

function fetchAgents() {
  return apiClient
    .get<Response>('lc/all-agents')
    .then(response => response.data);
}
