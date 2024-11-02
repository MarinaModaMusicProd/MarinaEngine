import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {AgentSettings, CompactAgent} from '@helpdesk/agents/agent';
import {NormalizedModel} from '@ui/types/normalized-model';
import {Permission} from '@common/auth/permission';
import {BaseAgentsQueryKey} from '@livechat/dashboard/agents/base-agents-query-key';

interface Response extends BackendResponse {
  agent: CompactAgent;
}

export interface UpdateAgentPayload {
  first_name?: string;
  last_name?: string;
  image?: string;
  agent_settings?: AgentSettings;
  groups?: NormalizedModel[];
  roles?: NormalizedModel[];
  permissions?: Permission[];
}

export function useUpdateAgent(
  form: UseFormReturn<Partial<UpdateAgentPayload>>,
) {
  const navigate = useNavigate();
  const {agentId} = useParams();
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: UpdateAgentPayload) => updateAgent(agentId!, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: BaseAgentsQueryKey,
      });
      toast(trans(message('Updated agent')));
      navigate('../../', {relative: 'path'});
    },
    onError: r => onFormQueryError(r, form),
  });
}

function updateAgent(agentId: string, payload: UpdateAgentPayload) {
  const workingHours: AgentSettings['working_hours'] = {};
  Object.entries(payload.agent_settings?.working_hours ?? {}).forEach(
    ([key, value]) => {
      if (value.enable) {
        workingHours[key] = {
          from: value.from,
          to: value.to,
        };
      }
    },
  );

  const newPayload = {
    ...payload,
    groups: payload.groups?.map(g => g.id),
    roles: payload.roles?.map(r => r.id),
    agent_settings: {
      ...payload.agent_settings,
      working_hours: Object.keys(workingHours).length ? workingHours : null,
    },
  };

  return apiClient
    .put<Response>(`helpdesk/agents/${agentId}`, newPayload)
    .then(r => r.data);
}
