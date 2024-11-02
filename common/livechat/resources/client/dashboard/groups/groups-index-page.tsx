import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {IconButton} from '@ui/buttons/icon-button';
import {Trans} from '@ui/i18n/trans';
import teamSvg from '@common/admin/roles/team.svg';
import {ColumnConfig} from '@common/datatable/column-config';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {Group} from '@helpdesk/groups/group';
import {MoreHorizIcon} from '@ui/icons/material/MoreHoriz';
import {Avatar} from '@ui/avatar/avatar';
import {AvatarGroup} from '@ui/avatar/avatar-group';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {DeleteGroupDialog} from '@livechat/dashboard/groups/delete-group-dialog';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {
  NameWithAvatar,
  NameWithAvatarPlaceholder,
} from '@common/datatable/column-templates/name-with-avatar';
import {Skeleton} from '@ui/skeleton/skeleton';
import {useEchoStore} from '@livechat/widget/chat/broadcasting/echo-store';
import {OnlineStatusCircle} from '@ui/badge/online-status-circle';
import {helpdeskChannel} from '@helpdesk/websockets/helpdesk-channel';

const columnConfig: ColumnConfig<Group>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    header: () => <Trans message="Group" />,
    body: (group, row) =>
      row.isPlaceholder ? (
        <NameWithAvatarPlaceholder showDescription className="max-w-100" />
      ) : (
        <NameWithAvatar
          label={<Trans message={group.name} />}
          avatarLabel={group.name}
          alwaysShowAvatar
          description={
            <Trans
              message="[one 1 member|other :count members]"
              values={{count: group.users?.length || 0}}
            />
          }
        />
      ),
  },
  {
    key: 'members',
    header: () => <Trans message="Members" />,
    body: (group, row) => {
      return row.isPlaceholder ? (
        <Skeleton variant="avatar" radius="rounded-full" />
      ) : (
        <AvatarGroup className="min-h-40">
          {group.users?.map(user => (
            <Avatar
              key={user.id}
              src={user.image}
              label={user.name}
              link={`/users/${user.id}`}
              fallback="initials"
            />
          ))}
        </AvatarGroup>
      );
    },
  },
  {
    key: 'status',
    header: () => <Trans message="Status" />,
    body: (group, row) =>
      row.isPlaceholder ? (
        <Skeleton className="max-w-200" />
      ) : (
        <GroupStatusColumn group={group} />
      ),
  },
  {
    key: 'default',
    header: () => <Trans message="Default" />,
    hideHeader: true,
    body: group =>
      group.default ? (
        <Chip className="w-max" radius="rounded-panel" size="sm">
          <Trans message="Default" />
        </Chip>
      ) : null,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    visibleInMode: 'all',
    align: 'end',
    width: 'w-42 flex-shrink-0',
    body: (group, row) =>
      row.isPlaceholder ? (
        <Skeleton variant="rect" size="w-24 h-24" />
      ) : (
        <GroupOptionsTrigger group={group} />
      ),
  },
];

interface GroupStatusColumnProps {
  group: Group;
}
function GroupStatusColumn({group}: GroupStatusColumnProps) {
  const onlineUsers = useEchoStore(s => s.presence[helpdeskChannel.name]);

  // have not connected to presence channel yet
  if (!onlineUsers) {
    return <Skeleton className="max-w-200" />;
  }

  const onlineAgentCount =
    group.users?.filter(user => onlineUsers.find(u => u.id === user.id))
      .length || 0;

  return (
    <div className="flex items-center gap-6">
      <OnlineStatusCircle isOnline={!!onlineAgentCount} />
      <Trans
        message=":count of :total online"
        values={{
          count: onlineAgentCount,
          total: group.users?.length || 0,
        }}
      />
    </div>
  );
}

interface GroupOptionsTriggerProps {
  group: Group;
}
function GroupOptionsTrigger({group}: GroupOptionsTriggerProps) {
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  return (
    <Fragment>
      <DialogTrigger
        type="modal"
        isOpen={deleteGroupDialogOpen}
        onOpenChange={setDeleteGroupDialogOpen}
      >
        <DeleteGroupDialog groupId={group.id} />
      </DialogTrigger>
      <MenuTrigger>
        <IconButton size="md" className="text-muted">
          <MoreHorizIcon />
        </IconButton>
        <Menu>
          <Item value="edit" elementType={Link} to={`${group.id}/edit`}>
            <Trans message="Edit" />
          </Item>
          <Item
            value="reports"
            elementType={Link}
            to={`/dashboard/reports/groups/${group.id}`}
          >
            <Trans message="View reports" />
          </Item>
          {!group.default && (
            <Item
              value="delete"
              className="text-danger"
              onSelected={() => {
                setDeleteGroupDialogOpen(true);
              }}
            >
              <Trans message="Delete" />
            </Item>
          )}
        </Menu>
      </MenuTrigger>
    </Fragment>
  );
}

export function GroupsIndexPage() {
  const navigate = useNavigate();
  return (
    <DataTablePage
      className="dashboard-stable-scrollbar"
      enableSelection={false}
      endpoint="helpdesk/groups"
      queryKey={['groups']}
      queryParams={{with: 'users'}}
      skeletonsWhileLoading={1}
      title={<Trans message="Groups" />}
      columns={columnConfig}
      actions={<Actions />}
      cellHeight="h-70"
      border="border-none"
      onRowAction={group => {
        navigate(`${group.id}/edit`);
      }}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={teamSvg}
          title={<Trans message="No groups have been created yet" />}
          filteringTitle={<Trans message="No matching groups" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton elementType={Link} to="new">
      <Trans message="Add new group" />
    </DataTableAddItemButton>
  );
}
