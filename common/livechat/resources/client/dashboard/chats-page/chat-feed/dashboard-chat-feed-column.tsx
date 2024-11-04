import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {DashboardChatSectionHeader} from '@livechat/dashboard/chats-page/dashboard-chat-section-header';
import {ChatVisitorName} from '@livechat/dashboard/chats-page/chat-visitor-name';
import {IconButton} from '@ui/buttons/icon-button';
import {LinkIcon} from '@ui/icons/material/Link';
import {MoreHorizIcon} from '@ui/icons/material/MoreHoriz';
import {InfoIcon} from '@ui/icons/material/Info';
import {DashboardChatFeed} from '@livechat/dashboard/chats-page/chat-feed/dashboard-chat-feed';
import React, {Fragment, ReactElement, useState} from 'react';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {Trans} from '@ui/i18n/trans';
import {useUpdateChatStatus} from '@livechat/dashboard/chats-page/chat-feed/use-update-chat-status';
import {Chat} from '@livechat/widget/chat/chat';
import {ChatBubbleIcon} from '@livechat/widget/chat/icons/chat-bubble-icon';
import {CloseIcon} from '@ui/icons/material/Close';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';

interface Props {
  query: ReturnType<typeof useDashboardChat>;
  rightSidebarOpen: boolean;
  onRightSidebarOpen: () => void;
  noResultsMessage: ReactElement;
}
export function DashboardChatFeedColumn({
  query,
  rightSidebarOpen,
  onRightSidebarOpen,
  noResultsMessage,
}: Props) {
  let content: ReactElement | null;

  if (query.data) {
    content = (
      <DashboardChatFeed chat={query.data.chat} visitor={query.data.visitor} />
    );
  } else if (query.isLoading) {
    content = null;
  } else {
    content = <div className="m-auto p-40">{noResultsMessage}</div>;
  }

  return (
    <Fragment>
      <DashboardChatSectionHeader>
        {query.data && (
          <Fragment>
            <div className="mr-8 text-lg font-semibold">
              <ChatVisitorName visitor={query.data.visitor} />
            </div>
            <IconButton className="ml-auto">
              <LinkIcon />
            </IconButton>
            <MoreActionsButton chat={query.data.chat} />
            {!rightSidebarOpen && (
              <IconButton onClick={() => onRightSidebarOpen()}>
                <InfoIcon />
              </IconButton>
            )}
          </Fragment>
        )}
      </DashboardChatSectionHeader>
      {content}
    </Fragment>
  );
}

interface MoreActionsButtonProps {
  chat: Chat;
}
function MoreActionsButton({chat}: MoreActionsButtonProps) {
  const updateStatus = useUpdateChatStatus(chat.id);
  const [confirmCloseIsOpen, setConfirmCloseIsOpen] = useState(false);
  return (
    <Fragment>
      <DialogTrigger
        type="modal"
        isOpen={confirmCloseIsOpen}
        onOpenChange={isOpen => setConfirmCloseIsOpen(isOpen)}
      >
        <CloseChatDialog chat={chat} />
      </DialogTrigger>
      <MenuTrigger>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
        <Menu>
          <Item
            startIcon={
              chat.status === 'closed' ? <ChatBubbleIcon /> : <CloseIcon />
            }
            value="toggle"
            onSelected={() => {
              if (chat.status === 'closed') {
                updateStatus.mutate({
                  status: 'active',
                });
              } else {
                setConfirmCloseIsOpen(true);
              }
            }}
          >
            {chat.status === 'closed' ? (
              <Trans message="Open chat" />
            ) : (
              <Trans message="Close chat" />
            )}
          </Item>
        </Menu>
      </MenuTrigger>
    </Fragment>
  );
}

interface CloseChatDialogProps {
  chat: Chat;
}
function CloseChatDialog({chat}: CloseChatDialogProps) {
  const updateStatus = useUpdateChatStatus(chat.id);
  const {close} = useDialogContext();
  return (
    <ConfirmationDialog
      isDanger
      isLoading={updateStatus.isPending}
      title={<Trans message="Close chat" />}
      confirm={<Trans message="Close" />}
      body={
        <Trans
          message="Are you sure you want to close the chat with :user?"
          values={{
            user: (
              <strong>
                <ChatVisitorName visitor={chat.visitor} className="inline" />
              </strong>
            ),
          }}
        />
      }
      onConfirm={() => {
        updateStatus.mutate({status: 'closed'}, {onSuccess: () => close()});
      }}
    />
  );
}
