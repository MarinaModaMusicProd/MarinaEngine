import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useMutation} from '@tanstack/react-query';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {User} from '@common/auth/user';
import {userFollows} from '@app/web-player/users/user-follows-store';

interface Response extends BackendResponse {}

interface Payload {
  user: User;
}

export function useFollowUser() {
  return useMutation((payload: Payload) => followUser(payload), {
    onSuccess: (response, {user}) => {
      userFollows().add(user.id);
      toast(message('Following :name', {values: {name: user.display_name}}));
      queryClient.invalidateQueries(['users']);
    },
    onError: r => showHttpErrorToast(r),
  });
}

function followUser({user}: Payload): Promise<Response> {
  return apiClient.post(`users/${user.id}/follow`).then(r => r.data);
}
