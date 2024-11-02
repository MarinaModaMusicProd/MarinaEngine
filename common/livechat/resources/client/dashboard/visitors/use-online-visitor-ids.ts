import {useEchoStore} from '@livechat/widget/chat/broadcasting/echo-store';
import {helpdeskChannel} from '@helpdesk/websockets/helpdesk-channel';
import {useSettings} from '@ui/settings/use-settings';

const demoUserIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function useIsVisitorOnline(visitorId: number | string): boolean {
  const {site} = useSettings();
  return !!useEchoStore(s => {
    if (site.demo && demoUserIds.includes(+visitorId)) {
      return true;
    }
    return s.presence[helpdeskChannel.name]?.find(
      u => `${u.id}` === `${visitorId}`,
    );
  });
}

export function useOnlineVisitorIds(): (number | string)[] {
  const {site} = useSettings();
  return useEchoStore(s => {
    let onlineUsers = (s.presence[helpdeskChannel.name] ?? [])
      .filter(user => !user.isAgent)
      .map(user => user.id);
    if (site.demo) {
      onlineUsers = onlineUsers.concat(demoUserIds);
    }
    return onlineUsers;
  });
}
