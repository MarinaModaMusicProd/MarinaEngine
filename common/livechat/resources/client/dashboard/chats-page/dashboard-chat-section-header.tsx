import {ReactNode} from 'react';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
  showSeparator?: boolean;
}
export function DashboardChatSectionHeader({
  children,
  showSeparator = true,
}: Props) {
  return (
    <div
      className={clsx(
        'flex h-56 flex-shrink-0 items-center px-16',
        showSeparator && 'border-b',
      )}
    >
      {children}
    </div>
  );
}
