import {Trans} from '@ui/i18n/trans';
import {FormattedRelativeTime} from '@ui/i18n/formatted-relative-time';
import clsx from 'clsx';

interface Props {
  date: string;
  className?: string;
}
export function ChatFeedDateSeparator({date, className}: Props) {
  return (
    <div className={clsx('flex items-center gap-8', className)}>
      <div className="h-1 flex-auto bg-divider" />
      <div className="rounded-panel bg-chip px-6 py-2 text-xs">
        <Trans message="Started" />
        {' - '}
        <FormattedRelativeTime date={date} style="long" />
      </div>
      <div className="h-1 flex-auto bg-divider" />
    </div>
  );
}
