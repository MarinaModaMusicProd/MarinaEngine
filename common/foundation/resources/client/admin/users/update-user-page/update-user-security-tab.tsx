import {ChangePasswordPanel} from '@common/auth/ui/account-settings/change-password-panel/change-password-panel';
import {useOutletContext} from 'react-router-dom';
import {TwoFactorPanel} from '@common/auth/ui/account-settings/two-factor-panel';
import {SessionsPanel} from '@common/auth/ui/account-settings/sessions-panel/sessions-panel';
import {SocialLoginPanel} from '@common/auth/ui/account-settings/social-login-panel';
import {User} from '@ui/types/user';

export function UpdateUserSecurityTab() {
  const user = useOutletContext() as User;
  return (
    <div>
      <ChangePasswordPanel />
      <TwoFactorPanel user={user} />
      <SocialLoginPanel user={user} />
      <SessionsPanel />
    </div>
  );
}
