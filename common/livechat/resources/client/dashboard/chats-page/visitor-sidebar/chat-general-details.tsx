import {ChatVisitorName} from '@livechat/dashboard/chats-page/chat-visitor-name';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {now} from '@internationalized/date';
import {Trans} from '@ui/i18n/trans';
import clsx from 'clsx';
import {VisitorAvatar} from '@livechat/widget/chat/avatars/visitor-avatar';
import React, {ReactNode} from 'react';
import {UseDashboardChatResponse} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {GroupIcon} from '@ui/icons/material/Group';
import {PersonIcon} from '@ui/icons/material/Person';
import {AgentAvatar} from '@livechat/widget/chat/avatars/agent-avatar';
import {ChatVisitor} from '@livechat/widget/chat/chat';
import {Avatar} from '@ui/avatar/avatar';

interface Props {
  data: UseDashboardChatResponse;
  className?: string;
}
export function ChatGeneralDetails({data, className}: Props) {
  const visitor = data.visitor;
  const agent = data.chat.assignee;
  const group = data.chat.group;

  // todo: maybe show assign to agent and department dialogs when clicking on Assignee and department buttons, see how livechat assigning works
  // todo: show department when implemented

  return (
    <div className={clsx('m-20', className)}>
      <VisitorSidebarHeader visitor={visitor} />
      <DetailLayout
        label={<Trans message="Assignee" />}
        value={
          agent ? (
            <DetailValue image={<AgentAvatar user={agent} size="xs" />}>
              {agent.name}
            </DetailValue>
          ) : (
            <DetailValue image={<PersonIcon size="sm" />}>
              <Trans message="Unassigned" />
            </DetailValue>
          )
        }
      />
      <DetailLayout
        label={<Trans message="Group" />}
        value={
          group ? (
            <DetailValue image={<Avatar label={group.name} size="xs" />}>
              {group.name}
            </DetailValue>
          ) : (
            <DetailValue image={<GroupIcon size="sm" />}>
              <Trans message="Unassigned" />
            </DetailValue>
          )
        }
      />
    </div>
  );
}

interface VisitorSidebarHeaderProps {
  visitor: ChatVisitor;
  className?: string;
}
export function VisitorSidebarHeader({
  visitor,
  className,
}: VisitorSidebarHeaderProps) {
  return (
    <div
      className={clsx(
        'mb-12 flex items-center gap-12 border-b pb-18',
        className,
      )}
    >
      <VisitorAvatar visitor={visitor} size="w-64 h-64" />
      <div>
        <ChatVisitorName
          className="text-base font-semibold"
          visitor={visitor}
        />
        {visitor.email && <div className="text-sm">{visitor.email}</div>}
        <div className="mb-2 text-sm">
          {visitor.country}, {visitor.city}
        </div>
        <div className="text-sm text-muted">
          <FormattedDate date={now(visitor.timezone)} preset="time" />{' '}
          <Trans message="local time" />
        </div>
      </div>
    </div>
  );
}

interface DetailLayoutProps {
  label: ReactNode;
  value: ReactNode;
}

export function DetailLayout({label, value}: DetailLayoutProps) {
  return (
    <div className="flex py-4 text-sm">
      <div className="w-2/5 text-muted">{label}</div>
      <div className="w-3/5">{value}</div>
    </div>
  );
}

interface DetailValueProps {
  image: ReactNode;
  children: ReactNode;
}

export function DetailValue({image, children}: DetailValueProps) {
  return (
    <div className="flex items-center gap-6">
      {image}
      {children}
    </div>
  );
}
