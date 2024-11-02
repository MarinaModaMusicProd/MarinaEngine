import {Chip} from '@ui/forms/input-field/chip-field/chip';
import React, {ReactElement, useState} from 'react';
import {useUploadAvatar} from '@common/auth/ui/account-settings/avatar/upload-avatar';
import {useRemoveAvatar} from '@common/auth/ui/account-settings/avatar/remove-avatar';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {ImageSelector} from '@common/uploads/components/image-selector';
import {Avatar} from '@ui/avatar/avatar';
import {User} from '@ui/types/user';
import {Trans} from '@ui/i18n/trans';
import {ErrorOutlineIcon} from '@ui/icons/material/ErrorOutline';

interface Props {
  user: User;
  badge?: ReactElement;
}
export function UpdateUserPageHeader({user, badge}: Props) {
  const isSuspended = user.banned_at !== null;
  const banReason = user.bans?.[0]?.comment;
  return (
    <div className="container mx-auto mb-44 mt-38 px-24">
      <div className="flex gap-32">
        <div className="relative">
          <AvatarSelector user={user} />
          <div className="absolute right-0 top-2">{badge}</div>
        </div>
        <div>
          {!!user.roles.length && (
            <Chip radius="rounded-panel" size="sm" className="mb-6 w-max">
              {user.roles[0].name}
            </Chip>
          )}
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <div className="mt-4 text-sm text-muted">{user.email}</div>
        </div>
      </div>
      {isSuspended && (
        <div className="mt-24 flex w-max items-center gap-8 rounded-panel bg-danger-lighter px-10 py-6 text-sm text-danger-darker">
          <ErrorOutlineIcon size="sm" />
          {banReason ? (
            <Trans message="Suspended: :reason" values={{reason: banReason}} />
          ) : (
            <Trans message="Suspended" />
          )}
        </div>
      )}
    </div>
  );
}

interface AvatarManagerProps {
  user: User;
}

function AvatarSelector({user}: AvatarManagerProps) {
  const uploadAvatar = useUploadAvatar({user});
  const removeAvatar = useRemoveAvatar({user});
  const [value, setValue] = useState(user.image);
  return (
    <FileUploadProvider>
      <ImageSelector
        value={value}
        diskPrefix="avatars"
        variant="avatar"
        stretchPreview
        previewSize="w-90 h-90"
        placeholderIcon={
          <Avatar label={user.name} size="w-full h-full text-2xl" circle />
        }
        showRemoveButton
        onChange={url => {
          const onSuccess = {
            onSuccess: () => setValue(url),
          };
          if (url) {
            uploadAvatar.mutate({url}, onSuccess);
          } else {
            removeAvatar.mutate(undefined, onSuccess);
          }
        }}
      />
    </FileUploadProvider>
  );
}
