import {useQuery} from '@tanstack/react-query';
import {getWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';
import {useOnlineAgentIds} from '@livechat/dashboard/agents/use-is-agent-online';
import {fetchCompactLivechatAgents} from '@livechat/dashboard/agents/use-all-dashboard-agents';

export function useAllWidgetAgents() {
  const {data} = useAllWidgetAgentsQuery();
  return data?.agents || [];
}

export function useAllWidgetAgentsQuery() {
  return useQuery({
    queryKey: ['users', 'agents', 'widget', 'all'],
    queryFn: () => fetchCompactLivechatAgents(),
    initialData: () => {
      return {agents: getWidgetBootstrapData().agents};
    },
  });
}

export function useWidgetAgentsAcceptingChats() {
  const agents = useAllWidgetAgents();
  const onlineAgentIds = useOnlineAgentIds();
  return agents.filter(agent => {
    return agent.acceptsChats && onlineAgentIds.includes(agent.id);
  });
}
