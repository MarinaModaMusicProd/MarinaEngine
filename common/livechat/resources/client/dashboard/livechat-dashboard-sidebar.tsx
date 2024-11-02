import clsx from 'clsx';
import React from 'react';
import {Trans} from '@ui/i18n/trans';
import {useSettings} from '@ui/settings/use-settings';
import {CustomMenu, CustomMenuItem} from '@common/menus/custom-menu';
import {Badge} from '@ui/badge/badge';
import {useUnseenChatsStore} from '@livechat/dashboard/unseen-chats/unseen-chats-store';

interface Props {
  className?: string;
  isCompactMode?: boolean;
}
export function LivechatDashboardSidebar({className, isCompactMode}: Props) {
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
        menu="dashboard-sidebar"
        orientation="vertical"
        onlyShowIcons={isCompactMode}
        iconSize={isCompactMode ? 'md' : 'sm'}
        gap={isCompactMode ? 'gap-2' : 'gap-8'}
        itemClassName={({isActive}) => {
          return clsx(
            'w-full rounded-button',
            isCompactMode
              ? 'w-48 h-48 items-center justify-center'
              : 'py-12 px-16 block',
            isActive
              ? 'bg-primary/6 text-primary font-semibold'
              : 'hover:bg-hover',
          );
        }}
      >
        {(item, menuItemProps) => (
          <CustomMenuItem
            key={item.id}
            {...menuItemProps}
            position="relative"
            extraContent={
              item.action === '/agent/chats' ? <ChatsMenuItemBadge /> : null
            }
          />
        )}
      </CustomMenu>
      {!isCompactMode && (
        <div className="mt-auto gap-14 px-16 text-xs">
          <Trans message="Version: :number" values={{number: version}} />
        </div>
      )}
    </div>
  );
}

function ChatsMenuItemBadge() {
  const unseenChats = useUnseenChatsStore(s => s.chats.filter(c => c.unseen));

  if (!unseenChats.length) return null;

  return (
    <Badge top="top-2" right="right-2">
      {unseenChats.length}
    </Badge>
  );
}
