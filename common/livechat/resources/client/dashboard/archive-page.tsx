import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {Navigate, useParams} from 'react-router-dom';
import {ChatPageLayout} from '@livechat/dashboard/chats-page/chat-page-layout';
import {DashboardChatFeedColumn} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed-column';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import chatSvg from '@livechat/dashboard/chats-page/chat-feed/chat.svg';
import {Trans} from '@ui/i18n/trans';
import {DashboardChatInfoSidebar} from '@livechat/dashboard/chats-page/visitor-sidebar/dashboard-chat-info-sidebar';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {Fragment} from 'react';
import {DashboardChatSectionHeader} from '@livechat/dashboard/chats-page/dashboard-chat-section-header';
import {useActiveDashboardChat} from '@livechat/dashboard/chats-page/queries/use-active-dashboard-chat';
import {useArchivedChats} from '@livechat/dashboard/chats-page/queries/use-archived-chats';
import {AnimatePresence, m} from 'framer-motion';
import {ChatListSkeleton} from '@livechat/dashboard/chats-page/chat-list/chat-list-skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {ChatListItem} from '@livechat/dashboard/chats-page/chat-list/chat-list-item';

export function ArchivePage() {
  const {chatId} = useParams();
  // todo: add search, newest/oldest sorting, and maybe filters, same as livechat
  const chatListQuery = useArchivedChats({order: 'created_at|desc'});
  const activeChatQuery = useActiveDashboardChat();

  const [rightSidebarOpen, setRightSidebarOpen] = useLocalStorage(
    'dash.archive.right',
    true,
  );

  if (!chatId && !!chatListQuery.data?.pagination.data.length) {
    return (
      <Navigate
        to={`/dashboard/archive/${chatListQuery.data.pagination.data[0].id}`}
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
  );
}

interface AllChatsAsideProps {
  chatsQuery: ReturnType<typeof useArchivedChats>;
  activeChatQuery: ReturnType<typeof useDashboardChat>;
}
function AllChatsAside({chatsQuery, activeChatQuery}: AllChatsAsideProps) {
  const {chatId: activeChatId} = useParams();
  const allChats = chatsQuery.data?.pagination.data ?? [];
  const activeChat = activeChatQuery.data?.chat;

  // make sure active chat is always shown in left sidebar,
  // even if it does not exist in pagination
  if (activeChat && !allChats.some(chat => chat.id === activeChat.id)) {
    allChats.unshift(activeChat);
  }

  return (
    <Fragment>
      <DashboardChatSectionHeader>
        <h1 className="text-lg font-semibold">
          <Trans message="Archive" />
        </h1>
      </DashboardChatSectionHeader>

      <AnimatePresence initial={false} mode="wait">
        {!allChats.length ? (
          <ChatListSkeleton isLoading={chatsQuery.isLoading} />
        ) : (
          <Fragment>
            <m.div {...opacityAnimation} key="chat-list-items">
              {allChats.map(chat => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={`${activeChatId}` === `${chat.id}`}
                  className="min-h-[78px] border-b"
                />
              ))}
            </m.div>
          </Fragment>
        )}
      </AnimatePresence>
    </Fragment>
  );
}
