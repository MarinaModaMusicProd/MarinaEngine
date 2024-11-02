import {useOutletContext} from 'react-router-dom';
import {LocalizationPanel} from '@common/auth/ui/account-settings/localization-panel';
import {User} from '@ui/types/user';

export function UpdateUserDatetimeTab() {
  const user = useOutletContext() as User;
  return <LocalizationPanel user={user} />;
}
