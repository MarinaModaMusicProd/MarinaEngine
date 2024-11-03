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

export function useUnfollowUser() {
  return useMutation((payload: Payload) => unfollowUser(payload), {
    onSuccess: (response, {user}) => {
      userFollows().remove(user.id);
      toast(
        message('Stopped following :name', {values: {name: user.display_name}})
      );
      queryClient.invalidateQueries(['users']);
    },
    onError: r => showHttpErrorToast(r),
  });
}

function unfollowUser({user}: Payload): Promise<Response> {
  return apiClient.post(`users/${user.id}/unfollow`).then(r => r.data);
}
