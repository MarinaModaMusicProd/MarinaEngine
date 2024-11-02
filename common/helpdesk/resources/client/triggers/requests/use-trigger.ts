import {useQuery} from '@tanstack/react-query';
import {useParams} from 'react-router-dom';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Trigger} from '@helpdesk/triggers/trigger';

export interface FetchTriggerResponse extends BackendResponse {
  trigger: Trigger;
}

export function useTrigger() {
  const {triggerId} = useParams();
  return useQuery({
    queryKey: ['triggers', `${triggerId}`],
    queryFn: () => fetchTrigger(triggerId!),
  });
}

async function fetchTrigger(triggerId: number | string) {
  return apiClient
    .get<FetchTriggerResponse>(`triggers/${triggerId}`)
    .then(response => response.data);
}
