import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {
  LengthAwarePaginationResponse,
  PaginatedBackendResponse,
} from '@common/http/backend-response/pagination-response';
import {useAuth} from '@common/auth/use-auth';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {useRef} from 'react';
import {useFilter} from '@ui/i18n/use-filter';

interface Response extends PaginatedBackendResponse<CannedReply> {}

const perPage = 30;

export function useCannedReplies(searchTerm: string | null = '') {
  const {user} = useAuth();
  const totalCount = useRef<number | undefined>();
  const {contains} = useFilter({sensitivity: 'base'});

  const query = useQuery<Response>({
    queryKey: ['helpdesk', 'canned-replies', `${user?.id}`, searchTerm],
    queryFn: ({signal}) =>
      fetchCannedReplies(user!.id, searchTerm ?? '', signal),
    placeholderData: keepPreviousData,
    initialData: () => {
      if (totalCount.current && totalCount.current <= perPage && searchTerm) {
        const allRepliesResponse = queryClient.getQueryData<Response>([
          'helpdesk',
          'canned-replies',
          `${user?.id}`,
          '',
        ]);
        if (allRepliesResponse) {
          return {
            ...allRepliesResponse,
            pagination: {
              ...allRepliesResponse.pagination,
              data: allRepliesResponse.pagination.data.filter(reply =>
                contains(reply.name, searchTerm),
              ),
            },
          };
        }
      }

      return undefined;
    },
  });

  if (!totalCount.current) {
    totalCount.current = (
      query.data?.pagination as LengthAwarePaginationResponse
    )?.total;
  }

  return {
    replies: query.data?.pagination.data ?? [],
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}

async function fetchCannedReplies(
  userId: number,
  query: string,
  signal?: AbortSignal,
) {
  if (query) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return apiClient
    .get<Response>('helpdesk/canned-replies', {
      params: {forUser: userId, perPage, query, paginate: 'lengthAware'},
      signal,
    })
    .then(response => response.data);
}
