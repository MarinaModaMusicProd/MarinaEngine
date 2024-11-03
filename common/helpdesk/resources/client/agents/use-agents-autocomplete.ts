import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {NormalizedModel} from '@ui/types/normalized-model';

interface Response extends BackendResponse {
  users: NormalizedModel[];
}

interface Props {
  query?: string;
}

export function useAgentsAutocomplete(props: Props) {
  return useQuery({
    queryKey: ['helpdesk', 'agents', 'autocomplete'],
    queryFn: () => fetchAgents(props),
  });
}

function fetchAgents({query}: Props) {
  return apiClient
    .get<Response>(`helpdesk/autocomplete/agents`, {params: {query}})
    .then(response => response.data);
}
