import React, {Fragment, ReactNode, useState} from 'react';
import {Link} from 'react-router-dom';
import {IconButton} from '@ui/buttons/icon-button';
import {Trans} from '@ui/i18n/trans';
import teamSvg from '@common/admin/roles/team.svg';
import {ColumnConfig} from '@common/datatable/column-config';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {MoreHorizIcon} from '@ui/icons/material/MoreHoriz';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {
  NameWithAvatar,
  NameWithAvatarPlaceholder,
} from '@common/datatable/column-templates/name-with-avatar';
import {Skeleton} from '@ui/skeleton/skeleton';
import {CompactAgent} from '@helpdesk/agents/agent';
import {useIsAgentOnline} from '@livechat/dashboard/agents/use-is-agent-online';
import {OnlineStatusCircle} from '@ui/badge/online-status-circle';
import {useAgentPermissions} from '@livechat/dashboard/agents/use-agent-permissions';
import {useAuth} from '@common/auth/use-auth';
import {DeleteUserDialog} from '@common/admin/users/update-user-page/update-user-page-actions';
import {useSettings} from '@ui/settings/use-settings';
import {InviteAgentsDialog} from '@livechat/dashboard/agents/invites/invite-agents-dialog';
import {AgentIndexPageTabs} from '@livechat/dashboard/agents/agent-index-page/agent-index-page-tabs';
import {BanUserDialog} from '@common/admin/users/ban-user-dialog';
import {useUnbanUser} from '@common/admin/users/requests/use-unban-user';
import {BaseAgentsQueryKey} from '@livechat/dashboard/agents/base-agents-query-key';

const columnConfig: ColumnConfig<CompactAgent>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    sortingKey: 'email',
    header: () => <Trans message="Agent" />,
    body: (agent, row) =>
      row.isPlaceholder ? (
        <NameWithAvatarPlaceholder showDescription className="max-w-100" />
      ) : (
        <NameWithAvatar
          label={agent.name}
          alwaysShowAvatar
          description={agent.email}
          avatarCircle
        />
      ),
  },
  {
    key: 'role',
    header: () => <Trans message="Role" />,
    body: (agent, row) => {
      return row.isPlaceholder ? (
        <Skeleton variant="rect" className="max-w-80" />
      ) : agent.roles?.length ? (
        <Chip className="w-max capitalize" radius="rounded-panel" size="sm">
          {agent.roles[0].name}
        </Chip>
      ) : null;
    },
  },
  {
    key: 'status',
    header: () => <Trans message="Status" />,
    allowsSorting: true,
    body: agent => <AgentStatusColumn agent={agent} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    visibleInMode: 'all',
    align: 'end',
    width: 'w-42 flex-shrink-0',
    body: (agent, row) =>
      row.isPlaceholder ? (
        <Skeleton variant="rect" size="w-24 h-24" />
      ) : (
        <AgentOptionsTrigger agent={agent} />
      ),
  },
];

interface AgentStatusColumnProps {
  agent: CompactAgent;
}
function AgentStatusColumn({agent}: AgentStatusColumnProps) {
  const {chat_integrated} = useSettings();
  const isAgentOnline = useIsAgentOnline(agent.id);
  if (agent.banned_at) {
    return (
      <StatusMessage color="bg-danger">
        <Trans message="Suspended" />
      </StatusMessage>
    );
  }
  if (!isAgentOnline) {
    return (
      <StatusMessage color="bg-chip">
        <Trans message="Offline" />
      </StatusMessage>
    );
  } else if (!chat_integrated) {
    return (
      <StatusMessage color="bg-positive">
        <Trans message="Online" />
      </StatusMessage>
    );
  }
  if (agent.agent_settings?.accepts_chats) {
    return (
      <StatusMessage color="bg-positive">
        <Trans message="Accepting chats" />
      </StatusMessage>
    );
  }
  return (
    <StatusMessage color="bg-danger">
      <Trans message="Not accepting chats" />
    </StatusMessage>
  );
}

interface StatusMessageProps {
  color: string;
  children: ReactNode;
}
const StatusMessage = ({color, children}: StatusMessageProps) => (
  <div className="flex items-center gap-6">
    <OnlineStatusCircle color={color} />
    {children}
  </div>
);

interface AgentOptionsTriggerProps {
  agent: CompactAgent;
}
function AgentOptionsTrigger({agent}: AgentOptionsTriggerProps) {
  const unban = useUnbanUser(agent.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const {canEditAgent, canDeleteAgent} = useAgentPermissions(agent.id);

  return (
    <Fragment>
      <DialogTrigger
        type="modal"
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DeleteUserDialog userId={agent.id} />
      </DialogTrigger>
      <DialogTrigger
        type="modal"
        isOpen={banDialogOpen}
        onOpenChange={setBanDialogOpen}
      >
        <BanUserDialog user={agent} />
      </DialogTrigger>
      <MenuTrigger>
        <IconButton size="md" className="text-muted">
          <MoreHorizIcon />
        </IconButton>
        <Menu>
          {canEditAgent && (
            <Item value="edit" elementType={Link} to={`${agent.id}/details`}>
              <Trans message="Edit" />
            </Item>
          )}
          <Item
            value="reports"
            elementType={Link}
            to={`/dashboard/reports/agents/${agent.id}`}
          >
            <Trans message="View reports" />
          </Item>
          {canDeleteAgent &&
            (agent.banned_at ? (
              <Item value="suspend" onSelected={() => unban.mutate()}>
                <Trans message="Reactivate" />
              </Item>
            ) : (
              <Item value="suspend" onSelected={() => setBanDialogOpen(true)}>
                <Trans message="Suspend" />
              </Item>
            ))}
          {canDeleteAgent && (
            <Item
              value="delete"
              className="text-danger"
              onSelected={() => setDeleteDialogOpen(true)}
            >
              <Trans message="Delete" />
            </Item>
          )}
        </Menu>
      </MenuTrigger>
    </Fragment>
  );
}

export function AgentsIndexPage() {
  const navigate = useNavigate();
  const {user, hasPermission} = useAuth();
  return (
    <Fragment>
      <AgentIndexPageTabs />
      <DataTablePage
        className="dashboard-stable-scrollbar"
        enableSelection={false}
        endpoint="helpdesk/agents"
        queryKey={BaseAgentsQueryKey}
        skeletonsWhileLoading={1}
        title={<Trans message="Agents" />}
        columns={columnConfig}
        actions={<Actions />}
        cellHeight="h-70"
        border="border-none"
        onRowAction={agent => {
          if (user?.id === agent.id || hasPermission('users.update')) {
            navigate(`${agent.id}/details`);
          }
        }}
        emptyStateMessage={
          <DataTableEmptyStateMessage
            image={teamSvg}
            title={<Trans message="No agents have been created yet" />}
            filteringTitle={<Trans message="No matching agents" />}
          />
        }
      />
    </Fragment>
  );
}

function Actions() {
  return (
    <DialogTrigger type="modal">
      <DataTableAddItemButton>
        <Trans message="Invite agents" />
      </DataTableAddItemButton>
      <InviteAgentsDialog />
    </DialogTrigger>
  );
}
