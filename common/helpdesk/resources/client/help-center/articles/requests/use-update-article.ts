import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {Article} from '@helpdesk/help-center/articles/article';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {
  articleEditorFormValueToPayload,
  CreateArticlePayload,
} from '@helpdesk/help-center/articles/requests/use-create-article';

interface Response extends BackendResponse {
  article: Article;
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> {
  id: number;
}

export function useUpdateArticle(form?: UseFormReturn<UpdateArticlePayload>) {
  return useMutation({
    mutationFn: (payload: UpdateArticlePayload) => updateArticle(payload),
    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({queryKey: ['categories']}),
        queryClient.invalidateQueries({queryKey: ['articles']}),
      ]);
    },
    onError: err =>
      form ? onFormQueryError(err, form) : showHttpErrorToast(err),
  });
}

function updateArticle({
  id,
  ...formValue
}: UpdateArticlePayload): Promise<Response> {
  return apiClient
    .put(`hc/articles/${id}`, articleEditorFormValueToPayload(formValue))
    .then(r => r.data);
}
