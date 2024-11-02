import {ReactNode} from 'react';
import clsx from 'clsx';
import {useThemeSelector} from '@ui/themes/theme-selector-context';
import {CssTheme} from '@ui/themes/css-theme';

interface Props {
  label?: ReactNode;
  children?: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  color?: string;
}
export function WidgetScreenHeader({
  label,
  children,
  color,
  start,
  end,
}: Props) {
  const {selectedTheme} = useThemeSelector();
  if (!color) {
    color = getDefaultColor(selectedTheme);
  }
  return (
    <div
      className={clsx(
        'flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-t-panel p-6',
        color,
      )}
    >
      <div className="flex w-full items-center justify-between gap-8">
        <div className="mr-auto flex-1">{start}</div>
        <div className="flex-auto text-center text-base font-semibold leading-[42px]">
          {label}
        </div>
        <div className="ml-auto flex flex-1 justify-end">{end}</div>
      </div>
      {children && <div className="mt-8 w-full">{children}</div>}
    </div>
  );
}

function getDefaultColor(theme: CssTheme) {
  switch (theme.values['--be-navbar-color'] ?? 'primary') {
    case 'bg':
      return `bg text-main border-b`;
    case 'bg-alt':
      return `bg-alt text-main border-b`;
    case 'transparent':
      return `bg-transparent text-main border-b`;
    default:
      return `bg-primary text-on-primary border-b border-b-primary`;
  }
}
