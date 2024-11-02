import {ReactNode} from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
  children: ReactNode;
  color: 'primary' | 'chip' | 'note';
  alignRight: boolean;
  attachmentCount?: number;
  allowBreak?: boolean;
  onClick?: () => void;
}
export function ChatFeedBubble({
  className,
  children,
  color,
  alignRight,
  attachmentCount,
  allowBreak,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'w-max max-w-full rounded-panel p-14 text-sm leading-tight',
        getColor(color),
        attachmentCount ? 'mb-8' : 'text-center',
        alignRight ? 'ml-auto' : 'mr-auto',
        allowBreak
          ? 'break-words'
          : 'overflow-hidden overflow-ellipsis whitespace-nowrap',
        className,
      )}
    >
      {children}
    </div>
  );
}

function getColor(color: 'primary' | 'chip' | 'note') {
  switch (color) {
    case 'primary':
      return 'bg-primary text-on-primary';
    case 'chip':
      return 'bg-chip';
    case 'note':
      return 'bg-note dark:bg-transparent';
  }
}
