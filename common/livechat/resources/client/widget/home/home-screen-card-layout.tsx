import clsx from 'clsx';
import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}
export function HomeScreenCardLayout({children, className}: Props) {
  return (
    <div
      className={clsx(
        'rounded-panel border bg text-sm shadow-[0_2px_8px_rgba(0,0,0,.06)] dark:bg-alt',
        className,
      )}
    >
      {children}
    </div>
  );
}
