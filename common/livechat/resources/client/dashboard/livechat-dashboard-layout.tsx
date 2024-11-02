import {DashboardLayout} from '@common/ui/dashboard-layout/dashboard-layout';
import {DashboardNavbar} from '@common/ui/dashboard-layout/dashboard-navbar';
import {DashboardSidenav} from '@common/ui/dashboard-layout/dashboard-sidenav';
import {DashboardContent} from '@common/ui/dashboard-layout/dashboard-content';
import {Outlet} from 'react-router-dom';
import {LivechatDashboardSidebar} from '@livechat/dashboard/livechat-dashboard-sidebar';
import {useDashboardWebsocketListener} from '@livechat/dashboard/use-dashboard-websocket-listener';

export function LivechatDashboardLayout() {
  useDashboardWebsocketListener();

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
