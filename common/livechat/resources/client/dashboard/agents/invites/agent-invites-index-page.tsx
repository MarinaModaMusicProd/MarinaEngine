import React, {Fragment, useState} from 'react';
import {IconButton} from '@ui/buttons/icon-button';
import {Trans} from '@ui/i18n/trans';
import teamSvg from '@common/admin/roles/team.svg';
import {ColumnConfig} from '@common/datatable/column-config';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {MoreHorizIcon} from '@ui/icons/material/MoreHoriz';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {
  NameWithAvatar,
  NameWithAvatarPlaceholder,
} from '@common/datatable/column-templates/name-with-avatar';
import {Skeleton} from '@ui/skeleton/skeleton';
import {InviteAgentsDialog} from '@livechat/dashboard/agents/invites/invite-agents-dialog';
import {AgentIndexPageTabs} from '@livechat/dashboard/agents/agent-index-page/agent-index-page-tabs';
import {AgentInvite} from '@livechat/dashboard/agents/invites/agent-invite';
import {Button} from '@ui/buttons/button';
import {useResendAgentInvite} from '@livechat/dashboard/agents/invites/requests/use-resend-agent-invite';
import {useRevokeAgentInvite} from '@livechat/dashboard/agents/invites/requests/use-revoke-agent-invite';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {useAuth} from '@common/auth/use-auth';
import useClipboard from 'react-use-clipboard';
import {useSettings} from '@ui/settings/use-settings';
import {toast} from '@ui/toast/toast';
import {BaseAgentsQueryKey} from '@livechat/dashboard/agents/base-agents-query-key';

const columnConfig: ColumnConfig<AgentInvite>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    sortingKey: 'email',
    header: () => <Trans message="Email" />,
    body: (invite, row) =>
      row.isPlaceholder ? (
        <NameWithAvatarPlaceholder showDescription className="max-w-100" />
      ) : (
        <NameWithAvatar
          label={invite.email.split('@')[0]}
          alwaysShowAvatar
          description={invite.email}
          avatarCircle
        />
      ),
  },
  {
    key: 'role',
    header: () => <Trans message="Role" />,
    body: (invite, row) => {
      return row.isPlaceholder ? (
        <Skeleton variant="rect" className="max-w-80" />
      ) : invite.role ? (
        <Chip className="w-max capitalize" radius="rounded-panel" size="sm">
          {invite.role.name}
        </Chip>
      ) : null;
    },
  },
  {
    key: 'status',
    header: () => <Trans message="Status" />,
    hideHeader: true,
    body: agent => <InviteStatusColumn invite={agent} />,
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
        <InviteOptionsTrigger invite={agent} />
      ),
  },
];

export function AgentInvitesIndexPage() {
  return (
    <Fragment>
      <AgentIndexPageTabs />
      <DataTablePage
        enableSelection={false}
        endpoint="helpdesk/agents/invites"
        queryKey={[...BaseAgentsQueryKey, 'invites']}
        skeletonsWhileLoading={1}
        title={<Trans message="Invited agents" />}
        columns={columnConfig}
        actions={
          <DialogTrigger type="modal">
            <DataTableAddItemButton>
              <Trans message="Invite agents" />
            </DataTableAddItemButton>
            <InviteAgentsDialog />
          </DialogTrigger>
        }
        cellHeight="h-70"
        border="border-none"
        emptyStateMessage={
          <DataTableEmptyStateMessage
            image={teamSvg}
            title={<Trans message="No invites have been sent yet" />}
            filteringTitle={<Trans message="No matching invites" />}
          />
        }
      />
    </Fragment>
  );
}

interface InviteStatusColumnProps {
  invite: AgentInvite;
}
function InviteStatusColumn({invite}: InviteStatusColumnProps) {
  const resendInvite = useResendAgentInvite();
  return (
    <Button
      variant="outline"
      color="primary"
      size="xs"
      disabled={resendInvite.isPending}
      onClick={() => {
        resendInvite.mutate({inviteId: invite.id});
      }}
    >
      <Trans message="Resend" />
    </Button>
  );
}

interface InviteOptionsTriggerProps {
  invite: AgentInvite;
}
function InviteOptionsTrigger({invite}: InviteOptionsTriggerProps) {
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const {hasPermission} = useAuth();
  const {base_url} = useSettings();
  const [, copyLink] = useClipboard(
    `${base_url}/join/agents/${invite.id}?email=${encodeURIComponent(
      invite.email,
    )}`,
  );
  return (
    <Fragment>
      <DialogTrigger
        type="modal"
        isOpen={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
      >
        <RevokeInviteDialog inviteId={invite.id} />
      </DialogTrigger>
      <MenuTrigger>
        <IconButton size="md" className="text-muted">
          <MoreHorizIcon />
        </IconButton>
        <Menu>
          <Item
            value="copy"
            onSelected={() => {
              copyLink();
              toast({message: 'Link copied'});
            }}
          >
            <Trans message="Copy invite link" />
          </Item>
          {hasPermission('users.create') && (
            <Item
              value="delete"
              className="text-danger"
              onSelected={() => {
                setRevokeDialogOpen(true);
              }}
            >
              <Trans message="Revoke" />
            </Item>
          )}
        </Menu>
      </MenuTrigger>
    </Fragment>
  );
}

interface RevokeInviteDialogProps {
  inviteId: number;
}
function RevokeInviteDialog({inviteId}: RevokeInviteDialogProps) {
  const revokeInvite = useRevokeAgentInvite();
  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Revoke invite" />}
      body={<Trans message="Are you sure you want to revoke this invite?" />}
      confirm={<Trans message="Revoke" />}
      isLoading={revokeInvite.isPending}
      onConfirm={() => {
        revokeInvite.mutate({inviteId});
      }}
    />
  );
}
