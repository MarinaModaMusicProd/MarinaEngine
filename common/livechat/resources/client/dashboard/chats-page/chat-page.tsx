import {useDashboardChats} from '@livechat/dashboard/chats-page/queries/use-dashboard-chats';
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
import {Fragment} from 'react';
import {ChatPageLayout} from '@livechat/dashboard/chats-page/chat-page-layout';
import {useActiveDashboardChat} from '@livechat/dashboard/chats-page/queries/use-active-dashboard-chat';
import {AnimatePresence, m} from 'framer-motion';
import {ChatListGroup} from '@livechat/dashboard/chats-page/chat-list/chat-list-group';
import {ChatListSkeleton} from '@livechat/dashboard/chats-page/chat-list/chat-list-skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';

// todo: create new chat via sockets when customer starts a chat and it does not exist yet
// todo: show chat event text in left sidebar as well
// todo: show pick from queue, assign to me, un-archive etc button instead of text editor, same as livechat
// todo: send ticket status and agent change via sockets, test with two different browsers/agents

// todo: maybe add "users", "roles", "suspended users" tabs in agents index page, same as intercom, or maybe just have a link to common admin area, if there's enough stuff to show there that is not in dashboard (localizations, etc)

// todo: fire all events into echo "agents" channel and invalidate queries, instead of editing the cache directly. Refactor all currents echo events into the agents channel and query resetting as well (except for widget new message event maybe)
// todo: listen for chat status changes as well and invalidate queries
// todo: set chat assignment (auto/manual) per department, save as livechat
// todo: add margin between separate chat list groups
// todo: add other conversations to the right sidebar, show conversation in modal or drawer on click, same as intercom
// todo: update right sidebar skeleton to match new layout
// todo: when chat is not assigned to current agent, lock text editor to only allow notes and not replies

export function ChatPage() {
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
        to={`/dashboard/chats/${chatListQuery.data?.firstChatId}`}
        replace
      />
    );
  }

  return (
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
  );
}

interface AllChatsAsideProps {
  chatsQuery: ReturnType<typeof useDashboardChats>;
  activeChatQuery: ReturnType<typeof useDashboardChat>;
}
function AllChatsAside({chatsQuery, activeChatQuery}: AllChatsAsideProps) {
  const {chatId} = useParams();
  const groupedChats = chatsQuery.data?.groupedChats;
  const activeChat = activeChatQuery.data?.chat;

  // make sure active chat is always shown in left sidebar,
  // even if it does not exist in pagination
  // todo:
  // if (activeChat && !allChats.some(chat => chat.id === activeChat.id)) {
  //   allChats.unshift(activeChat);
  // }

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
                <ChatListGroup key={name} name={name as any} chats={chats} />
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
