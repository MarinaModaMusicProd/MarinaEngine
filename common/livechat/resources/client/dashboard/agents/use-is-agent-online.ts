import {
  echoStore,
  useEchoStore,
} from '@livechat/widget/chat/broadcasting/echo-store';
import {helpdeskChannel} from '@helpdesk/websockets/helpdesk-channel';

export function useIsAgentOnline(agentId: number | string): boolean {
  return !!useEchoStore(
    s => s.presence[helpdeskChannel.name]?.find(user => user.id === +agentId),
  );
}

export function useOnlineAgentIds(): number[] {
  return useEchoStore(s => {
    return (s.presence[helpdeskChannel.name] ?? [])
      .filter(user => user.isAgent)
      .map(agent => agent.id as number);
  });
}

export function getOnlineAgentIds(): number[] {
  return (echoStore().presence[helpdeskChannel.name] ?? [])
    .filter(user => user.isAgent)
    .map(agent => agent.id as number);
}
