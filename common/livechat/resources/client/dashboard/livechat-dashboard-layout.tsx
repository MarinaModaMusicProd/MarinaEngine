import {DashboardLayout} from '@common/ui/dashboard-layout/dashboard-layout';
import {DashboardNavbar} from '@common/ui/dashboard-layout/dashboard-navbar';
import {DashboardSidenav} from '@common/ui/dashboard-layout/dashboard-sidenav';
import {DashboardContent} from '@common/ui/dashboard-layout/dashboard-content';
import {Outlet} from 'react-router-dom';
import {LivechatDashboardSidebar} from '@livechat/dashboard/livechat-dashboard-sidebar';
import {useEffect} from 'react';
import {echoStore} from '@livechat/widget/chat/broadcasting/echo-store';
import {queryClient} from '@common/http/query-client';
import {helpdeskChannel} from '@helpdesk/websockets/helpdesk-channel';

export function LivechatDashboardLayout() {
  useEffect(() => {
    return echoStore().listen({
      channel: helpdeskChannel.name,
      events: [
        helpdeskChannel.events.conversations.created,
        helpdeskChannel.events.conversations.assigned,
        helpdeskChannel.events.conversations.statusChanged,
        helpdeskChannel.events.agents.updated,
        helpdeskChannel.events.visitors.created,
      ],
      type: 'presence',
      callback: e => {
        if (e.event.includes('conversations')) {
          queryClient.invalidateQueries({queryKey: ['dashboard', 'chats']});
        } else if (e.event.includes('agents')) {
          queryClient.invalidateQueries({queryKey: ['helpdesk', 'agents']});
        } else if (e.event.includes('visitors')) {
          queryClient.invalidateQueries({queryKey: ['lc', 'visitors']});
        }
      },
    });
  }, []);

  return (
    <DashboardLayout name="dashboard" leftSidenavCanBeCompact>
      <DashboardNavbar size="sm" menuPosition="dashboard-navbar" />
      <DashboardSidenav position="left" size="sm">
        <LivechatDashboardSidebar />
      </DashboardSidenav>
      <DashboardContent stableScrollbar={false}>
        <div className="bg dark:bg-alt">
          <Outlet />
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
