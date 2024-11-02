import white from './equalizer-white.gif';
import black from './equalizer-black.gif';
import clsx from 'clsx';
import {useIsDarkMode} from '@ui/themes/use-is-dark-mode';

interface EqualizerImageProps {
  className?: string;
  color?: 'black' | 'white';
}
export function EqualizerImage({className, color}: EqualizerImageProps) {
  const isDarkMode = useIsDarkMode();

  if (!color) {
    color = isDarkMode ? 'white' : 'black';
  }

  return (
    <div
      className={clsx('flex h-20 w-20 items-center justify-center', className)}
    >
      <img
        src={color === 'white' ? white : black}
        alt=""
        className="h-12 w-12"
        aria-hidden
      />
    </div>
  );
}
