import {
  DashboardChatGroup,
  useDashboardChats,
  UseDashboardChatsResponse,
} from '@livechat/dashboard/chats-page/queries/use-dashboard-chats';
import {Trans} from '@ui/i18n/trans';
import {Navigate, useParams} from 'react-router-dom';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {DashboardChatSectionHeader} from '@livechat/dashboard/chats-page/dashboard-chat-section-header';
import {DashboardChatInfoSidebar} from '@livechat/dashboard/chats-page/visitor-sidebar/dashboard-chat-info-sidebar';
import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {DashboardChatFeedColumn} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed-column';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import chatSvg from '@livechat/dashboard/chats-page/chat-feed/chat.svg';
import {Fragment, useMemo} from 'react';
import {ChatPageLayout} from '@livechat/dashboard/chats-page/chat-page-layout';
import {useActiveDashboardChat} from '@livechat/dashboard/chats-page/queries/use-active-dashboard-chat';
import {AnimatePresence, m} from 'framer-motion';
import {ChatListGroup} from '@livechat/dashboard/chats-page/chat-list/chat-list-group';
import {ChatListSkeleton} from '@livechat/dashboard/chats-page/chat-list/chat-list-skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {Chat} from '@livechat/widget/chat/chat';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {useClearUnseenChats} from '@livechat/dashboard/unseen-chats/use-clear-unseen-chats';

export function ChatPage() {
  useClearUnseenChats();
  const {chatId} = useParams();
  const chatListQuery = useDashboardChats();
  const activeChatQuery = useActiveDashboardChat();

  const [rightSidebarOpen, setRightSidebarOpen] = useLocalStorage(
    'dash.chat.right',
    true,
  );

  if (!chatId && chatListQuery.data?.firstChatId) {
    return (
      <Navigate
        to={`/agent/chats/${chatListQuery.data?.firstChatId}`}
        replace
      />
    );
  }

  if (activeChatQuery.data?.chat.status === 'closed') {
    return (
      <Navigate to={`/agent/archive/${activeChatQuery.data.chat.id}`} replace />
    );
  }

  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="Chats" />
      </StaticPageTitle>
      <ChatPageLayout
        leftSidebar={
          <AllChatsAside
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
                title={<Trans message="No active chats currently" />}
                description={
                  <Trans message="Chats assigned to you and unassigned chats will appear here." />
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

interface AllChatsAsideProps {
  chatsQuery: ReturnType<typeof useDashboardChats>;
  activeChatQuery: ReturnType<typeof useDashboardChat>;
}
function AllChatsAside({chatsQuery, activeChatQuery}: AllChatsAsideProps) {
  const groupedChats: UseDashboardChatsResponse['groupedChats'] =
    useMemo(() => {
      const activeChat = activeChatQuery.data?.chat;
      const chats =
        chatsQuery.data?.groupedChats ||
        ({} as UseDashboardChatsResponse['groupedChats']);

      // make sure active chat is always shown in left sidebar,
      // even if it does not exist in pagination
      if (activeChat && !chatsQuery.isLoading) {
        const allChats = Object.values(chats).flat() as Chat[];
        if (!allChats.some(chat => chat.id === activeChat.id)) {
          chats['other'] = [activeChat];
        }
      }
      return chats;
    }, [chatsQuery, activeChatQuery]);

  return (
    <Fragment>
      <DashboardChatSectionHeader>
        <h1 className="text-lg font-semibold">
          <Trans message="Chats" />
        </h1>
      </DashboardChatSectionHeader>
      <div className="compact-scrollbar flex-auto overflow-y-auto">
        <AnimatePresence initial={false} mode="wait">
          {groupedChats ? (
            <m.div key="grouped-chats" {...opacityAnimation}>
              {Object.entries(groupedChats).map(([name, chats]) => (
                <ChatListGroup
                  key={name}
                  name={name as DashboardChatGroup}
                  chats={chats}
                />
              ))}
            </m.div>
          ) : (
            <ChatListSkeleton isLoading={chatsQuery.isLoading} count={3} />
          )}
        </AnimatePresence>
      </div>
    </Fragment>
  );
}
