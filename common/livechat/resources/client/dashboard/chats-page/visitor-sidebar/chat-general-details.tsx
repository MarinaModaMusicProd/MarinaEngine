import {ChatVisitorName} from '@livechat/dashboard/chats-page/chat-visitor-name';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {now} from '@internationalized/date';
import {Trans} from '@ui/i18n/trans';
import clsx from 'clsx';
import {VisitorAvatar} from '@livechat/widget/chat/avatars/visitor-avatar';
import React, {Fragment, ReactNode} from 'react';
import {UseDashboardChatResponse} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {GroupIcon} from '@ui/icons/material/Group';
import {PersonIcon} from '@ui/icons/material/Person';
import {AgentAvatar} from '@livechat/widget/chat/avatars/agent-avatar';
import {ChatVisitor} from '@livechat/widget/chat/chat';
import {Avatar} from '@ui/avatar/avatar';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {TransferChatDialog} from '@livechat/dashboard/chats-page/assign-chat-dialog/transfer-chat-dialog';
import {useAllDashboardAgents} from '@livechat/dashboard/agents/use-all-dashboard-agents';
import {useHelpdeskGroupsAutocomplete} from '@helpdesk/groups/requests/use-helpdesk-groups-autocomplete';
import {BlockIcon} from '@ui/icons/material/Block';
import {FormattedDuration} from '@ui/i18n/formatted-duration';

interface Props {
  data: UseDashboardChatResponse;
}
export function ChatGeneralDetails({data}: Props) {
  // preload agents and groups for assign chat dialog
  useAllDashboardAgents();
  useHelpdeskGroupsAutocomplete();

  const visitor = data.visitor;
  const agent = data.chat.assignee;
  const group = data.chat.group;

  return (
    <div className="m-20">
      <VisitorSidebarHeader visitor={visitor} />
      <DetailLayout
        label={<Trans message="Assignee" />}
        value={
          <DialogTrigger type="modal">
            <button>
              {agent ? (
                <DetailValue image={<AgentAvatar user={agent} size="xs" />}>
                  {agent.name}
                </DetailValue>
              ) : (
                <DetailValue image={<PersonIcon size="sm" />}>
                  <Trans message="Unassigned" />
                </DetailValue>
              )}
            </button>
            <TransferChatDialog tab="agent" chat={data.chat} />
          </DialogTrigger>
        }
      />
      <DetailLayout
        label={<Trans message="Group" />}
        value={
          <DialogTrigger type="modal">
            <button>
              {group ? (
                <DetailValue image={<Avatar label={group.name} size="xs" />}>
                  {group.name}
                </DetailValue>
              ) : (
                <DetailValue image={<GroupIcon size="sm" />}>
                  <Trans message="Unassigned" />
                </DetailValue>
              )}
            </button>
            <TransferChatDialog tab="group" chat={data.chat} />
          </DialogTrigger>
        }
      />
      <SuspendedSection visitor={visitor} />
    </div>
  );
}

interface SuspendedSectionProps {
  visitor: ChatVisitor;
}
function SuspendedSection({visitor}: SuspendedSectionProps) {
  if (!visitor.banned_at) {
    return null;
  }

  const ban = visitor.bans?.[0];

  return (
    <Fragment>
      <div className="mt-12 flex items-center gap-6 text-sm text-danger">
        <BlockIcon size="sm" />
        <div>
          <Trans message="Suspended customer" />
          {ban?.expired_at && (
            <Fragment>
              {' '}
              ({<FormattedDuration endDate={ban.expired_at} verbose />})
            </Fragment>
          )}
        </div>
      </div>
      {ban?.comment && (
        <div className="mt-6 text-xs text-danger">{ban.comment}</div>
      )}
    </Fragment>
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
      <div className="w-100 text-muted">{label}</div>
      <div className="flex-auto">{value}</div>
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
