import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {ChatVisit, ChatVisitor} from '@livechat/widget/chat/chat';

interface Response {
  visitor: ChatVisitor;
  visits?: ChatVisit[];
}

interface Options {
  placeholderData?: {
    visitor: ChatVisitor;
  };
}

export function useVisitor(visitorId: string | number, options: Options = {}) {
  return useQuery<Response>({
    queryKey: ['visitor', `${visitorId}`],
    queryFn: () => fetchVisitor(visitorId),
    placeholderData: options.placeholderData,
  });
}

function fetchVisitor(visitorId: string | number) {
  return apiClient
    .get<Response>(`lc/visitors/${visitorId}`)
    .then(response => response.data);
}
