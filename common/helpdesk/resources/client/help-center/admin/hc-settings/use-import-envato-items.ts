import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {toast} from '@ui/toast/toast';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

export function useImportEnvatoItems() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: () => importItems(),
    onSuccess: () => {
      toast(trans(message('Envato items imported')));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function importItems(): Promise<Response> {
  return apiClient.post('envato/items/import').then(r => r.data);
}
