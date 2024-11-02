import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {Navigate, useParams, useSearchParams} from 'react-router-dom';
import {ChatPageLayout} from '@livechat/dashboard/chats-page/chat-page-layout';
import {DashboardChatFeedColumn} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed-column';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import chatSvg from '@livechat/dashboard/chats-page/chat-feed/chat.svg';
import {Trans} from '@ui/i18n/trans';
import {DashboardChatInfoSidebar} from '@livechat/dashboard/chats-page/visitor-sidebar/dashboard-chat-info-sidebar';
import React, {Fragment} from 'react';
import {useActiveDashboardChat} from '@livechat/dashboard/chats-page/queries/use-active-dashboard-chat';
import {useArchivedChats} from '@livechat/dashboard/chats-page/queries/use-archived-chats';
import {ArchivePageAside} from '@livechat/dashboard/archive-page/archive-page-aside';
import {useArchiveSort} from '@livechat/dashboard/archive-page/use-archive-sort';
import {useBackendFilterUrlParams} from '@common/datatable/filters/backend-filter-url-params';
import {BackendFiltersUrlKey} from '@common/datatable/filters/backend-filters-url-key';
import {useArchivePageFilters} from '@livechat/dashboard/archive-page/archive-page-filters';
import {StaticPageTitle} from '@common/seo/static-page-title';

export function ArchivePage() {
  const {chatId} = useParams();
  const [searchParams] = useSearchParams();
  const [sort] = useArchiveSort();
  const filters = useArchivePageFilters();
  const {encodedFilters} = useBackendFilterUrlParams(filters);
  const chatListQuery = useArchivedChats({
    order: sort === 'newest' ? 'created_at|desc' : 'created_at|asc',
    query: searchParams.get('query'),
    [BackendFiltersUrlKey]: encodedFilters,
  });

  const activeChatQuery = useActiveDashboardChat();

  const [rightSidebarOpen, setRightSidebarOpen] = useLocalStorage(
    'dash.archive.right',
    true,
  );

  if (!chatId && chatListQuery.items.length) {
    return (
      <Navigate to={`/agent/archive/${chatListQuery.items[0].id}`} replace />
    );
  }

  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="Archive" />
      </StaticPageTitle>
      <ChatPageLayout
        leftSidebar={
          <ArchivePageAside
            chatsQuery={chatListQuery}
            activeChatQuery={activeChatQuery}
          />
        }
        chatFeed={
          <DashboardChatFeedColumn
            query={activeChatQuery}
            rightSidebarOpen={rightSidebarOpen}
            onRightSidebarOpen={() => setRightSidebarOpen(true)}
            noResultsMessage={
              <IllustratedMessage
                size="sm"
                image={<SvgImage src={chatSvg} />}
                title={<Trans message="No archived chats yet" />}
                description={
                  <Trans message="Archives hold all chats closed by you or your team." />
                }
              />
            }
          />
        }
        rightSidebar={
          rightSidebarOpen ? (
            <DashboardChatInfoSidebar
              query={activeChatQuery}
              onClose={() => setRightSidebarOpen(false)}
            />
          ) : null
        }
      />
    </Fragment>
  );
}
