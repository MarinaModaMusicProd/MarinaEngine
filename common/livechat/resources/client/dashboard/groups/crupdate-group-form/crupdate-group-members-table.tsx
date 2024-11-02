import {ColumnConfig} from '@common/datatable/column-config';
import {Group, GroupUser} from '@helpdesk/groups/group';
import {Trans} from '@ui/i18n/trans';
import {NameWithAvatar} from '@common/datatable/column-templates/name-with-avatar';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {useFormContext} from 'react-hook-form';
import {CreateGroupPayload} from '@livechat/dashboard/groups/requests/use-create-group';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {useTrans} from '@ui/i18n/use-trans';
import {useFilter} from '@ui/i18n/use-filter';
import React, {Fragment, useMemo, useState} from 'react';
import {SortDescriptor} from '@common/ui/tables/types/sort-descriptor';
import {sortArrayOfObjects} from '@ui/utils/array/sort-array-of-objects';
import {TextField} from '@ui/forms/input-field/text-field/text-field';
import {message} from '@ui/i18n/message';
import {SearchIcon} from '@ui/icons/material/Search';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Button} from '@ui/buttons/button';
import {AddIcon} from '@ui/icons/material/Add';
import {SelectUserDialog} from '@common/users/select-user-dialog';
import {Table} from '@common/ui/tables/table';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import teamSvg from '@common/admin/roles/team.svg';
import {useSettings} from '@ui/settings/use-settings';
import {useNormalizedModels} from '@common/ui/normalized-model/use-normalized-models';

const agentEndpoint = 'helpdesk/autocomplete/agent';

const tableConfig: ColumnConfig<GroupUser>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    sortingKey: 'description',
    header: () => <Trans message="Agent" />,
    body: user => (
      <NameWithAvatar
        image={user.image}
        label={user.name}
        description={user.description}
        alwaysShowAvatar
      />
    ),
  },
  {
    key: 'role',
    allowsSorting: true,
    sortingKey: 'role.name',
    header: () => <Trans message="Role" />,
    body: user =>
      user.role ? (
        <Chip className="w-max capitalize" radius="rounded-button" size="sm">
          {user.role.name}
        </Chip>
      ) : null,
  },
  {
    key: 'chat_priority',
    allowsSorting: true,
    header: () => <Trans message="Chat priority" />,
    body: (user, row) => (
      <FormSelect
        name={`users[${row.index}].chat_priority`}
        selectionMode="single"
        size="sm"
        className="h-46 max-w-180 p-4"
        floatingWidth="auto"
        placement="top-start"
      >
        <Item
          value="primary"
          description={
            <Trans message="Chats will be assigned to this agent first." />
          }
        >
          <Trans message="Primary agent" />
        </Item>
        <Item
          value="backup"
          description={
            <Trans message="Chats will be assigned to this agent only if primary agent is not available or over their chat limit." />
          }
        >
          <Trans message="Backup agent" />
        </Item>
      </FormSelect>
    ),
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    visibleInMode: 'all',
    align: 'end',
    width: 'w-42 flex-shrink-0',
    body: (user, row) => {
      return <RemoveUserButton index={row.index} />;
    },
  },
];

interface RemoveUserButtonProps {
  index: number;
}
function RemoveUserButton({index}: RemoveUserButtonProps) {
  const {setValue, getValues, watch} = useFormContext<CreateGroupPayload>();
  const totalUsers = watch('users').length;
  return (
    <IconButton
      size="md"
      className="text-muted"
      disabled={totalUsers === 1}
      onClick={() => {
        setValue(
          'users',
          getValues('users').filter((_, i) => i !== index),
        );
      }}
    >
      <CloseIcon />
    </IconButton>
  );
}

interface CrupdateGroupMembersTableProps {
  group?: Group;
}
export function CrupdateGroupMembersTable({
  group,
}: CrupdateGroupMembersTableProps) {
  // preload agents for add member modal
  useNormalizedModels(agentEndpoint, {
    query: '',
    perPage: 14,
  });
  const {chat_integrated} = useSettings();
  const {trans} = useTrans();
  const {contains} = useFilter();
  const {setValue, formState, clearErrors} =
    useFormContext<CreateGroupPayload>();
  const [sortDescriptor, onSortChange] = useState<SortDescriptor>({
    orderBy: 'name',
    orderDir: 'asc',
  });
  const [query, setQuery] = useState('');

  const {watch} = useFormContext<CreateGroupPayload>();
  const formUsers = watch('users');
  const users = useMemo(() => {
    // sort array by specified key and direction
    const sortedArray = sortDescriptor.orderBy
      ? sortArrayOfObjects(
          formUsers,
          sortDescriptor.orderBy,
          sortDescriptor.orderDir,
        )
      : formUsers;

    return sortedArray.filter(user => contains(user.name, query));
  }, [sortDescriptor, formUsers, contains, query]);

  const filteredConfig = useMemo(() => {
    return tableConfig.filter(c => {
      // hide delete button if it's a default group
      if (c.key === 'actions' && group?.default) {
        return false;
      }
      if (c.key === 'chat_priority' && !chat_integrated) {
        return false;
      }
      return true;
    });
  }, [group, chat_integrated]);

  return (
    <Fragment>
      <div className="mb-24 flex items-center justify-between gap-14">
        <TextField
          size="sm"
          className="mr-auto min-w-180 max-w-350 flex-auto"
          inputWrapperClassName="mr-24 md:mr-0"
          placeholder={trans(message('Type to search...'))}
          startAdornment={<SearchIcon size="sm" />}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!group?.default && (
          <DialogTrigger
            type="modal"
            onClose={(users: GroupUser[] | null) => {
              if (!users) return;
              clearErrors('users');
              const uniqueUsers = [];
              for (const user of users) {
                if (!formUsers.find(u => u.id === user.id)) {
                  uniqueUsers.push({
                    ...user,
                    chat_priority: 'backup' as const,
                  });
                }
              }
              if (uniqueUsers.length) {
                setValue('users', [...formUsers, ...uniqueUsers], {
                  shouldDirty: true,
                });
              }
            }}
          >
            <Button variant="outline" color="primary" startIcon={<AddIcon />}>
              <Trans message="Add member" />
            </Button>
            <SelectUserDialog multiple endpoint={agentEndpoint} />
          </DialogTrigger>
        )}
      </div>
      <Table
        columns={filteredConfig}
        data={users}
        enableSelection={false}
        collapseOnMobile
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        cellHeight="h-70"
      />
      {!users.length && (
        <DataTableEmptyStateMessage
          className="mt-40"
          image={teamSvg}
          isFiltering={!!query}
          title={<Trans message="This group has no membeers yet" />}
          filteringTitle={<Trans message="No matching members" />}
        />
      )}
      {formState.errors.users?.message && (
        <div className="text-center text-danger">
          {formState.errors.users?.message}
        </div>
      )}
    </Fragment>
  );
}
