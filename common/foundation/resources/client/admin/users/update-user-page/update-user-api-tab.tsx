import {useOutletContext} from 'react-router-dom';
import {User} from '@ui/types/user';
import {AccessTokenPanel} from '@common/auth/ui/account-settings/access-token-panel/access-token-panel';

export function UpdateUserApiTab() {
  const user = useOutletContext() as User;
  return <AccessTokenPanel user={user} />;
}
