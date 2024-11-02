import {ChatVisit} from '@livechat/widget/chat/chat';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';

interface Response {
  visits: ChatVisit[];
}

export function pageVisitsQueryKey(visitorId: number | string) {
  return ['visits', `${visitorId}`];
}

export function usePageVisits(
  visitorId: number | string,
  initialData?: ChatVisit[],
) {
  return useQuery<Response>({
    queryKey: pageVisitsQueryKey(visitorId),
    queryFn: () => fetchVisits(visitorId),
    initialData: initialData ? () => ({visits: initialData}) : undefined,
  });
}

function fetchVisits(visitorId: number | string) {
  return apiClient
    .get<Response>(`lc/visitors/${visitorId}/visits`)
    .then(response => response.data);
}
