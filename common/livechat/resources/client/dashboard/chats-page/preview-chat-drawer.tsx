import React, {Fragment, ReactNode} from 'react';
import {useSearchParams} from 'react-router-dom';
import {AnimatePresence, m} from 'framer-motion';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {useDashboardChatMessages} from '@livechat/dashboard/chats-page/chat-feed/use-dashboard-chat-messages';
import {ChatFeedInfiniteScrollSentinel} from '@livechat/widget/chat/chat-feed-infinite-scroll-sentinel';
import {ChatFeedInfiniteScrollContainer} from '@livechat/widget/chat/feed/chat-feed-infinite-scroll-container';
import {DashboardChatFeedItem} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed-item';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {ChatFeedDateSeparator} from '@livechat/dashboard/chats-page/chat-feed/chat-feed-date-separator';
import {ChatVisitorName} from '@livechat/dashboard/chats-page/chat-visitor-name';
import {Underlay} from '@ui/overlays/underlay';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {Skeleton} from '@ui/skeleton/skeleton';
import clsx from 'clsx';
import {OpenInNewIcon} from '@ui/icons/material/OpenInNew';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {Trans} from '@ui/i18n/trans';
import {getChatStatusColor} from '@livechat/dashboard/chats-page/visitor-sidebar/recent-chats-panel';
import {Chat} from '@livechat/widget/chat/chat';

export function PreviewChatDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('previewChatId');

  const content = chatId ? (
    <Fragment>
      <Underlay
        position="fixed"
        isTransparent
        isBlurred={false}
        onClick={() => {
          searchParams.delete('previewChatId');
          setSearchParams(searchParams, {replace: true});
        }}
      />
      <m.aside
        initial={{x: '100%', opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: '100%', opacity: 0}}
        transition={{type: 'tween', duration: 0.14, origin: 1}}
        className="fixed right-0 top-54 z-10 h-[calc(100%-54px)] w-580 max-w-full border-l bg shadow-2xl"
      >
        <Content chatId={chatId} />
      </m.aside>
    </Fragment>
  ) : null;

  return <AnimatePresence initial={false}>{content}</AnimatePresence>;
}

interface ContentProps {
  chatId: string;
}

function Content({chatId}: ContentProps) {
  const chatQuery = useDashboardChat({chatId});
  const messageQuery = useDashboardChatMessages({chatId});

  if (chatQuery.data && messageQuery.data) {
    return (
      <m.div
        key="preview-messages"
        {...opacityAnimation}
        className="flex h-full flex-col"
      >
        <DrawerHeader status={chatQuery.data.chat.status}>
          <ChatVisitorName visitor={chatQuery.data.visitor} />
        </DrawerHeader>
        <div className="flex-auto overflow-y-auto p-16">
          <ChatFeedDateSeparator date={chatQuery.data.chat.created_at} />
          <ChatFeedInfiniteScrollSentinel query={messageQuery} />

          <ChatFeedInfiniteScrollContainer
            className="my-12 space-y-12"
            data={messageQuery.data?.pages}
          >
            {messageQuery.data?.pages.map(page =>
              page.pagination.data.map((message, index) => (
                <DashboardChatFeedItem
                  key={message.id}
                  index={index}
                  message={message}
                  allMessages={page.pagination.data}
                  visitor={chatQuery.data.visitor}
                />
              )),
            )}
          </ChatFeedInfiniteScrollContainer>
        </div>
      </m.div>
    );
  }

  return <Skeletons />;
}

interface DrawerHeaderProps {
  children: ReactNode;
  status?: Chat['status'];
}
function DrawerHeader({children, status}: DrawerHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('previewChatId');
  const navigate = useNavigate();
  return (
    <div className="flex flex-shrink-0 items-center gap-10 border-b px-16 py-8">
      <div className="font-semibold">{children}</div>
      {status && (
        <Chip size="xs" color={getChatStatusColor(status)}>
          <Trans message={status} />
        </Chip>
      )}
      <IconButton
        size="sm"
        className="ml-auto"
        onClick={() => navigate(`/agent/chats/${chatId}`)}
      >
        <OpenInNewIcon />
      </IconButton>
      <IconButton
        size="sm"
        iconSize="md"
        onClick={() => {
          searchParams.delete('previewChatId');
          setSearchParams(searchParams, {replace: true});
        }}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

function Skeletons() {
  return (
    <m.div key="preview-skeletons" {...opacityAnimation}>
      <DrawerHeader>
        <Skeleton className="min-w-84" />
      </DrawerHeader>
      <div className="flex flex-col gap-28 p-16">
        <MessageSkeleton align="left" />
        <MessageSkeleton align="right" height="h-80" />
        <MessageSkeleton align="left" height="h-100" />
        <MessageSkeleton align="right" height="h-60" />
        <MessageSkeleton align="left" height="h-80" />
      </div>
    </m.div>
  );
}

interface MessageSkeletonProps {
  height?: string;
  align: 'left' | 'right';
}
function MessageSkeleton({height = 'h-54', align}: MessageSkeletonProps) {
  return (
    <div
      className={clsx(
        'flex gap-8',
        align === 'right' && 'flex-row-reverse self-end',
      )}
    >
      <Skeleton variant="avatar" radius="rounded-full" className="h-32 w-32" />
      <Skeleton
        variant="rect"
        size={clsx(height, 'min-w-280 max-w-280')}
        className="flex-auto"
      />
    </div>
  );
}
