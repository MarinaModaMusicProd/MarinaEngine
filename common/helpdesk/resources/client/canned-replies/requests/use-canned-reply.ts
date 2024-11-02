import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {useRequiredParams} from '@common/ui/navigation/use-required-params';

interface Response extends BackendResponse {
  reply: CannedReply;
}

export function useCannedReply() {
  const {replyId} = useRequiredParams(['replyId']);
  return useQuery({
    queryKey: ['helpdesk', 'canned-replies', replyId],
    queryFn: () => fetchCannedReply(replyId),
  });
}

function fetchCannedReply(replyId: number | string) {
  return apiClient
    .get<Response>(`helpdesk/canned-replies/${replyId}`)
    .then(response => response.data);
}
