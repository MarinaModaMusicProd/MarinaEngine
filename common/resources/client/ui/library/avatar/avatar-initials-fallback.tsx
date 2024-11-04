import clsx from 'clsx';
import React, {forwardRef, useMemo} from 'react';
import {AvatarProps} from '@ui/avatar/avatar';

const colors = [
  '#3b82f6',
  '#6366f1',
  '#0284c7',
  '#9333ea',
  '#059669',
  '#ea580c',
  '#dc2626',
  '#06b6d4',
  '#e11d48',
];

interface Props {
  size: AvatarProps['size'];
  label: string;
  color?: string;
}
export const AvatarInitialsFallback = forwardRef<HTMLDivElement, Props>(
  ({size, label, color}, ref) => {
    const {initial, bgColor} = useMemo(() => {
      const hash = (label || '')
        .split('')
        .reduce((accum, val) => val.charCodeAt(0) + accum, label?.length || 0);
      return {
        initial: label.slice(0, 1).toUpperCase(),
        bgColor: colors[hash % colors.length],
      };
    }, [label]);
    return (
      <div
        ref={ref}
        style={!color ? {backgroundColor: bgColor} : undefined}
        className={clsx(
          'flex h-full w-full items-center justify-center font-semibold leading-normal text-on-primary',
          color,
          getTextFallbackFontSize(size),
        )}
      >
        {initial}
      </div>
    );
  },
);

function getTextFallbackFontSize(size: AvatarProps['size']) {
  switch (size) {
    case 'xs':
      return 'text-xs';
    case 'sm':
      return 'text-xs';
    case 'xl':
      return 'text-xl';
    default:
      return 'text-base';
  }
}
