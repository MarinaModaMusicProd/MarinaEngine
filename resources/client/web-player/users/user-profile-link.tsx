import {Link, LinkProps} from 'react-router-dom';
import clsx from 'clsx';
import React, {useMemo} from 'react';
import {slugifyString} from '@ui/utils/string/slugify-string';
import {CompactUser, User} from '@ui/types/user';

interface UserProfileLinkProps extends Omit<LinkProps, 'to'> {
  user: User;
  className?: string;
}
export function UserProfileLink({
  user,
  className,
  ...linkProps
}: UserProfileLinkProps) {
  const finalUri = useMemo(() => {
    return getUserProfileLink(user);
  }, [user]);

  return (
    <Link
      {...linkProps}
      className={clsx('hover:underline', className)}
      to={finalUri}
    >
      {user.name}
    </Link>
  );
}

export function getUserProfileLink(user: CompactUser): string {
  return `/user/${user.id}/${slugifyString(user.name)}`;
}
