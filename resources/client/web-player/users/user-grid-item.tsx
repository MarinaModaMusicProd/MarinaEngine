import {Link} from 'react-router-dom';
import {getUserProfileLink} from '@app/web-player/users/user-profile-link';
import {UserImage} from '@app/web-player/users/user-image';
import {User} from '@ui/types/user';
import {Trans} from '@ui/i18n/trans';

interface UserGridItemProps {
  user: User;
}
export function UserGridItem({user}: UserGridItemProps) {
  return (
    <div>
      <Link to={getUserProfileLink(user)}>
        <UserImage
          user={user}
          className="aspect-square w-full rounded shadow-md"
        />
      </Link>
      <div className="mt-12 text-sm">
        <div className="overflow-hidden overflow-ellipsis">
          <Link to={getUserProfileLink(user)}>{user.name}</Link>
        </div>
        {user.followers_count ? (
          <div className="mt-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-muted">
            <Trans
              message=":count followers"
              values={{count: user.followers_count}}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
