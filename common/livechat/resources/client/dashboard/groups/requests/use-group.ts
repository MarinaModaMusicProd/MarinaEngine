import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {useParams} from 'react-router-dom';
import {Group} from '@helpdesk/groups/group';

interface Response extends BackendResponse {
  group: Group;
}

export function useGroup() {
  const {groupId} = useParams();
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => fetchGroup(groupId!),
  });
}

function fetchGroup(groupId: number | string) {
  return apiClient
    .get<Response>(`helpdesk/groups/${groupId}`)
    .then(response => response.data);
}
