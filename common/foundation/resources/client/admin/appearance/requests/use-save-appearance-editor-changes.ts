import {useMutation} from '@tanstack/react-query';
import {AppearanceEditorValues} from '@common/admin/appearance/appearance-store';
import {toast} from '@ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';
import {message} from '@ui/i18n/message';
import {DeepPartial} from 'utility-types';
import {FetchAppearanceValuesResponse} from '@common/admin/appearance/requests/use-appearance-editor-values';

export const saveAppearanceChangesMutationKey = ['appearance-editor-save'];

export function useSaveAppearanceChanges() {
  return useMutation({
    mutationKey: saveAppearanceChangesMutationKey,
    mutationFn: (values: DeepPartial<AppearanceEditorValues>) => {
      return saveChanges(values);
    },
    onSuccess: async response => {
      queryClient.setQueryData(['admin/appearance/values'], response);
      toast(message('Changes saved'));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function saveChanges(changes: DeepPartial<AppearanceEditorValues>) {
  return apiClient
    .post<FetchAppearanceValuesResponse>(`admin/appearance`, {changes})
    .then(r => r.data);
}
