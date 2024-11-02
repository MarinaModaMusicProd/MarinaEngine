import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Button} from '@ui/buttons/button';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {Trans} from '@ui/i18n/trans';
import {Item} from '@ui/forms/listbox/item';
import React, {Fragment, ReactNode, useState} from 'react';
import {BanUserDialog} from '@common/admin/users/ban-user-dialog';
import {openDialog} from '@ui/overlays/store/dialog-store';
import {User} from '@ui/types/user';
import {useUnbanUser} from '@common/admin/users/requests/use-unban-user';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {useDeleteUser} from '@common/admin/users/requests/use-delete-user';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';

interface Props {
  user: User;
  children?: ReactNode;
}
export function UpdateUserPageActions({user, children}: Props) {
  const unban = useUnbanUser(user.id);
  const isSuspended = user.banned_at !== null;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <Fragment>
      <DialogTrigger
        type="modal"
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DeleteUserDialog userId={user.id} />
      </DialogTrigger>
      <MenuTrigger>
        <Button
          className="ml-auto"
          variant="outline"
          size="sm"
          endIcon={<KeyboardArrowDownIcon />}
        >
          <Trans message="Actions" />
        </Button>
        <Menu>
          {children}
          <Item
            value="toggleSuspension"
            onSelected={() => {
              if (isSuspended) {
                unban.mutate();
              } else {
                openDialog(BanUserDialog, {user});
              }
            }}
          >
            {isSuspended ? (
              <Trans message="Unsuspend user" />
            ) : (
              <Trans message="Suspend user" />
            )}
          </Item>
          <Item
            value="delete"
            onSelected={() => {
              setDeleteDialogOpen(true);
            }}
          >
            <Trans message="Delete user" />
          </Item>
        </Menu>
      </MenuTrigger>
    </Fragment>
  );
}

interface DeleteUserDialogProps {
  userId: number;
}
export function DeleteUserDialog({userId}: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser();
  const {close} = useDialogContext();
  const navigate = useNavigate();
  return (
    <ConfirmationDialog
      isDanger
      isLoading={deleteUser.isPending}
      title={<Trans message="Delete user" />}
      confirm={<Trans message="Delete" />}
      body={<Trans message="Are you sure you want to delete this user?" />}
      onConfirm={() => {
        deleteUser.mutate(
          {userId},
          {
            onSuccess: () => {
              close();
              navigate('..', {relative: 'path'});
            },
          },
        );
      }}
    />
  );
}
