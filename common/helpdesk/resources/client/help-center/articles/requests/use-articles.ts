import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {PaginationResponse} from '@common/http/backend-response/pagination-response';
import {Section} from '@helpdesk/help-center/categories/category';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Article} from '@helpdesk/help-center/articles/article';

export const fetchArticlesQueryKey = (params: UseArticlesParams) => [
  'articles',
  'admin',
  params,
];

export interface UseArticlesResponse extends BackendResponse {
  pagination: PaginationResponse<Article>;
  section?: Section;
}

export interface UseArticlesParams {
  sectionId?: number | string;
  order?: string;
}

export function useArticles(params: UseArticlesParams) {
  return useQuery({
    queryKey: fetchArticlesQueryKey(params),
    queryFn: () => fetchArticles(params),
  });
}

function fetchArticles(params: UseArticlesParams) {
  return apiClient
    .get<UseArticlesResponse>(`hc/articles`, {
      params: {paginate: 'simple', perPage: 30, ...params},
    })
    .then(response => response.data);
}
