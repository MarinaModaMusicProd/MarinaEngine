import {useSubmitChatMessage} from '@livechat/widget/chat/use-submit-chat-message';
import React, {Fragment, ReactElement} from 'react';
import {useNewMessageEvent} from '@livechat/widget/chat/broadcasting/use-new-message-event';
import {queryClient} from '@common/http/query-client';
import {ChatFeedMessage} from '@livechat/widget/chat/feed/chat-feed-message';
import {Trans} from '@ui/i18n/trans';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {ChatFeedInfiniteScrollContainer} from '@livechat/widget/chat/feed/chat-feed-infinite-scroll-container';
import {WidgetScreenHeader} from '@livechat/widget/widget-screen-header';
import {
  useWidgetChatMessages,
  widgetChatMessagesQueryKey,
} from '@livechat/widget/chat/active-chat-screen/use-widget-chat-messages';
import {usePlaceholderChatFeed} from '@livechat/widget/chat/active-chat-screen/use-placeholder-chat-feed';
import {WidgetChatTextEditor} from '@livechat/widget/chat/active-chat-screen/widget-chat-text-editor';
import {FileEntry} from '@common/uploads/file-entry';
import {Chat, ChatContentItem, ChatEvent} from '@livechat/widget/chat/chat';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {
  useWidgetChat,
  UseWidgetChatResponse,
} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';
import {IconButton} from '@ui/buttons/icon-button';
import {Link, useLocation} from 'react-router-dom';
import {KeyboardArrowLeftIcon} from '@ui/icons/material/KeyboardArrowLeft';
import {ActiveChatScreenHeader} from '@livechat/widget/chat/active-chat-screen/header/active-chat-screen-header';
import {Button} from '@ui/buttons/button';
import {SendIcon} from '@ui/icons/material/Send';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {useAllAgents} from '@livechat/widget/use-all-agents';

export function ActiveChatScreen() {
  const {data, fetchStatus} = useWidgetChat();
  const {state} = useLocation();

  let content: ReactElement;
  if (data?.chat) {
    content = <ChatFeed data={data} />;
  } else if (fetchStatus === 'idle') {
    content = <PlaceholderChatFeed />;
  } else {
    content = (
      <div className="flex h-full w-full items-center justify-center">
        <ProgressCircle isIndeterminate />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-auto flex-col">
      <WidgetScreenHeader
        start={
          <IconButton elementType={Link} to={state?.prevPath ?? '/'}>
            <KeyboardArrowLeftIcon />
          </IconButton>
        }
        label={<Trans message="Chat" />}
      />
      {content}
    </div>
  );
}

function PlaceholderChatFeed() {
  const {messages, handleSubmitMessage, isCreatingChat} =
    usePlaceholderChatFeed();
  return (
    <ChatFeedLayout
      header={<ActiveChatScreenHeader />}
      feed={
        <div className="space-y-12">
          {messages.map(message => (
            <WidgetChatFeedMessage key={message.id} message={message} />
          ))}
        </div>
      }
      editor={
        <WidgetChatTextEditor
          onSubmit={handleSubmitMessage}
          isLoading={isCreatingChat}
        />
      }
    />
  );
}

interface ChatFeedProps {
  data: UseWidgetChatResponse;
}
function ChatFeed({data}: ChatFeedProps) {
  const chatId = data.chat.id;
  const query = useWidgetChatMessages();

  // todo: use sound manager, maybe put into useNewMessageEvent

  useNewMessageEvent({
    chat: data.chat,
    onMessageCreated: () => {
      queryClient.invalidateQueries({
        queryKey: widgetChatMessagesQueryKey(chatId),
      });
    },
  });

  const submitMessage = useSubmitChatMessage(
    widgetChatMessagesQueryKey(chatId),
  );
  const handleSubmitMessage = (data: {body: string; files: FileEntry[]}) => {
    submitMessage.mutate({
      body: data.body,
      chatId,
      author: 'visitor',
      type: 'message',
      files: data.files,
    });
  };

  return (
    <ChatFeedLayout
      header={<ActiveChatScreenHeader data={data} />}
      feed={
        <Fragment>
          {query.data?.pages.map((page, index) => (
            <ChatFeedInfiniteScrollContainer
              key={page.pagination.current_page}
              index={index}
              totalPages={query.data.pages.length}
              className="my-12 space-y-12"
            >
              {page.pagination.data.map(message => (
                <WidgetChatFeedMessage
                  key={message.id}
                  message={message}
                  chat={data.chat}
                />
              ))}
            </ChatFeedInfiniteScrollContainer>
          ))}
        </Fragment>
      }
      editor={
        data.chat.status !== 'closed' ? (
          <WidgetChatTextEditor
            onSubmit={handleSubmitMessage}
            isLoading={submitMessage.isPending}
          />
        ) : (
          <div className="p-14">
            <Button
              variant="flat"
              color="primary"
              elementType={Link}
              to="/chats/new"
              endIcon={<SendIcon />}
              className="min-h-42 w-full"
            >
              <Trans message="New conversation" />
            </Button>
          </div>
        )
      }
    />
  );
}

interface WidgetChatFeedMessageProps {
  message: ChatContentItem;
  chat?: Chat;
}
function WidgetChatFeedMessage({message, chat}: WidgetChatFeedMessageProps) {
  if (message.type === 'event') {
    const text = <EventText event={message} chat={chat} />;
    return text ? (
      <div className="flex justify-center gap-4 text-xs text-muted">
        {text} -
        <time>
          <FormattedDate date={message.created_at} preset="time" />
        </time>
      </div>
    ) : null;
  }
  return (
    <ChatFeedMessage
      key={message.id}
      message={message}
      alignRight={message.author === 'visitor'}
      color={message.author === 'visitor' ? 'primary' : 'chip'}
      onAttachmentSelected={file => {
        window.open(file.url, '_blank')?.focus();
      }}
    />
  );
}

interface ChatFeedLayoutProps {
  header: ReactElement;
  feed: ReactElement;
  editor: ReactElement;
}
function ChatFeedLayout({header, feed, editor}: ChatFeedLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="compact-scrollbar stable-scrollbar min-h-0 flex-auto overflow-auto overscroll-contain px-14 pb-14">
        {header}
        {feed}
      </div>
      <FileUploadProvider>{editor}</FileUploadProvider>
    </div>
  );
}

interface EventTextProps {
  event: ChatEvent;
  chat?: Chat;
}
function EventText({event, chat}: EventTextProps) {
  const agents = useAllAgents();
  switch (event.body.name) {
    case 'visitor.startedChat':
      return <Trans message="You have started the chat" />;
    case 'closed.inactivity':
      return (
        <Trans message="The chat has been closed due to long user inactivity." />
      );
    case 'closed.byAgent':
      const currentAgent = agents.find(a => a.id === chat?.assigned_to);
      return (
        <Trans
          message=":agent has closed the chat"
          values={{agent: currentAgent?.name ?? event.body.closedBy}}
        />
      );
    case 'visitor.idle':
      return null;
    case 'visitor.leftChat':
      return <Trans message="You have left the chat" />;
    case 'agent.leftChat':
      if (event.body.oldAgent && event.body.newAgent) {
        return (
          <Trans
            message="You have been transferred to: :agent"
            values={{
              agent: event.body.newAgent,
            }}
          />
        );
      }
      return null;
    case 'agent.reassigned':
      if (event.body.newAgent) {
        return (
          <Trans
            message=":agent has joined the chat"
            values={{
              agent: event.body.newAgent,
            }}
          />
        );
      }
      return null;
  }
}
