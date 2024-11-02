import {ReactNode} from 'react';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
  marginTop?: string;
}
export function AppearanceSectionTitle({children, marginTop = 'mt-22'}: Props) {
  return (
    <div className={clsx('mb-6 text-sm font-semibold', marginTop)}>
      {children}
    </div>
  );
}
