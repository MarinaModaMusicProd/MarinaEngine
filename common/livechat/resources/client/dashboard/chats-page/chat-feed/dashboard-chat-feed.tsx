import {Chat, ChatVisitor} from '@livechat/widget/chat/chat';
import {
  dashboardChatMessagesQueryKey,
  useDashboardChatMessages,
} from '@livechat/dashboard/chats-page/chat-feed/use-dashboard-chat-messages';
import {useNewMessageEvent} from '@livechat/widget/chat/broadcasting/use-new-message-event';
import {ChatFeedInfiniteScrollSentinel} from '@livechat/widget/chat/chat-feed-infinite-scroll-sentinel';
import {useSoundManager} from '@livechat/widget/chat/broadcasting/use-sound-manager';
import {ChatFeedInfiniteScrollContainer} from '@livechat/widget/chat/feed/chat-feed-infinite-scroll-container';
import {queryClient} from '@common/http/query-client';
import {DashboardChatFeedItem} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed-item';
import {DashboardChatFeedBottomBar} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed-bottom-bar';
import {ChatFeedDateSeparator} from '@livechat/dashboard/chats-page/chat-feed/chat-feed-date-separator';
import {ChatTagList} from '@livechat/dashboard/chats-page/chat-tag-list/chat-tag-list';

interface Props {
  chat: Chat;
  visitor: ChatVisitor;
}
export function DashboardChatFeed({chat, visitor}: Props) {
  const query = useDashboardChatMessages({
    chatId: chat.id,
  });

  const {playSound} = useSoundManager();
  useNewMessageEvent({
    chat,
    onMessageCreated: async () => {
      await queryClient.invalidateQueries({
        queryKey: dashboardChatMessagesQueryKey(chat.id),
      });
      playSound('message');
    },
  });

  return (
    <div className="flex min-h-0 flex-auto flex-col">
      <div className="compact-scrollbar flex-auto overflow-y-auto p-16">
        <div>
          <ChatFeedDateSeparator date={chat.created_at} />
          <ChatFeedInfiniteScrollSentinel query={query} />
          {query.data?.pages.map((page, index) => (
            <ChatFeedInfiniteScrollContainer
              key={page.pagination.current_page}
              index={index}
              totalPages={query.data.pages.length}
              className="my-12 space-y-12"
            >
              {page.pagination.data.map((message, index) => (
                <DashboardChatFeedItem
                  key={message.id}
                  index={index}
                  message={message}
                  allMessages={page.pagination.data}
                  visitor={visitor}
                />
              ))}
            </ChatFeedInfiniteScrollContainer>
          ))}
        </div>
      </div>
      <DashboardChatFeedBottomBar chat={chat} />
      <ChatTagList tags={chat.tags} chatId={chat.id} />
    </div>
  );
}
