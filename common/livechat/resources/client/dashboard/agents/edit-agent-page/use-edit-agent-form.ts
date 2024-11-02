import {FullAgent} from '@helpdesk/agents/agent';
import {useForm} from 'react-hook-form';
import {UpdateAgentPayload} from '@livechat/dashboard/agents/edit-agent-page/use-update-agent';

export function useEditAgentForm(agent: FullAgent) {
  return useForm<UpdateAgentPayload>({
    defaultValues: {
      first_name: agent.first_name ?? '',
      last_name: agent.last_name ?? '',
      image: agent.image ?? '',
      groups: agent.groups,
      roles: agent.roles,
      permissions: [],
    },
  });
}
