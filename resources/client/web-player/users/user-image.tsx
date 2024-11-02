import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import clsx from 'clsx';
import {Trans} from '@ui/i18n/trans';
import {StarIcon} from '@ui/icons/material/Star';
import userDefaultImage from './user-default.svg';
import {User} from '@ui/types/user';

interface UserImageProps {
  user: User;
  className?: string;
  size?: string;
  showProBadge?: boolean;
}
export function UserImage({
  user,
  className,
  size,
  showProBadge,
}: UserImageProps) {
  const {trans} = useTrans();
  const showBadge = showProBadge && user.subscriptions?.find(s => s.valid);
  return (
    <div
      className={clsx(
        'relative isolate flex-shrink-0 overflow-hidden',
        size,
        className,
      )}
    >
      <img
        className="h-full w-full bg-fg-base/4 object-cover"
        draggable={false}
        src={getUserImage(user)}
        alt={trans(message('Avatar for :name', {values: {name: user.name}}))}
      />
      {showBadge && (
        <div
          className="absolute bottom-12 left-0 right-0 mx-auto flex w-max max-w-full items-center gap-6 rounded-full bg-black/60 px-8 py-4 text-sm text-white"
          color="positive"
        >
          <div className="rounded-full bg-primary p-1">
            <StarIcon className="text-white" size="sm" />
          </div>
          <Trans message="PRO user" />
        </div>
      )}
    </div>
  );
}

export function getUserImage(user: User): string {
  return user.image || userDefaultImage;
}
