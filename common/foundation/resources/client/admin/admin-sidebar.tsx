import clsx from 'clsx';
import React from 'react';
import {CustomMenu} from '../menus/custom-menu';
import {Trans} from '@ui/i18n/trans';
import {useSettings} from '@ui/settings/use-settings';

interface Props {
  className?: string;
  isCompactMode?: boolean;
}
export function AdminSidebar({className, isCompactMode}: Props) {
  const {version} = useSettings();
  return (
    <div
      className={clsx(
        className,
        isCompactMode ? 'p-6' : 'px-12 pb-16 pt-26',
        'hidden-scrollbar relative flex flex-col gap-20 overflow-y-auto border-r bg-alt text-sm font-medium text-muted',
      )}
    >
      <CustomMenu
        matchDescendants={to => to === '/admin'}
        menu="admin-sidebar"
        orientation="vertical"
        onlyShowIcons={isCompactMode}
        iconSize={isCompactMode ? 'md' : 'sm'}
        itemClassName={({isActive}) =>
          clsx(
            'w-full rounded-button',
            isCompactMode
              ? 'w-48 h-48 items-center justify-center'
              : 'py-12 px-16 block',
            isActive
              ? 'bg-primary/6 text-primary font-semibold'
              : 'hover:bg-hover',
          )
        }
        gap={isCompactMode ? 'gap-2' : 'gap-8'}
      />
      {!isCompactMode && (
        <div className="mt-auto gap-14 px-16 text-xs">
          <Trans message="Version: :number" values={{number: version}} />
        </div>
      )}
    </div>
  );
}
