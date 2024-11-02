import {Avatar, AvatarProps} from '@ui/avatar/avatar';
import {useContext} from 'react';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {CompactUser} from '@ui/types/user';

interface UserAvatarProps extends Omit<AvatarProps, 'label' | 'src' | 'link'> {
  user?: CompactUser;
}
export function UserAvatar({user, ...props}: UserAvatarProps) {
  const {auth} = useContext(SiteConfigContext);
  return (
    <Avatar
      {...props}
      label={user?.name}
      src={user?.image}
      link={user?.id && auth.getUserProfileLink?.(user)}
    />
  );
}
