import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {GetArticleResponse} from '@helpdesk/help-center/articles/requests/use-article';

export function useWidgetArticle(articleId: number | string) {
  return useQuery<GetArticleResponse>({
    queryKey: ['articles', 'widget', articleId],
    queryFn: () => fetchArticle(articleId),
    staleTime: Infinity,
  });
}

function fetchArticle(articleId: number | string) {
  return apiClient
    .get<GetArticleResponse>(`hc/articles/${articleId}`, {
      params: {loader: 'articlePage'},
    })
    .then(response => response.data);
}
