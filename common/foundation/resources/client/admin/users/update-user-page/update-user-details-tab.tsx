import {Trans} from '@ui/i18n/trans';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import React from 'react';
import {UserRoleSection} from '@common/admin/users/update-user-page/user-role-section';
import {useForm} from 'react-hook-form';
import {Link, useOutletContext} from 'react-router-dom';
import {User} from '@ui/types/user';
import {UpdateUserPayload} from '@common/admin/users/requests/user-update-user';
import {UpdateUserForm} from '@common/admin/users/update-user-page/update-user-form';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {useResendVerificationEmail} from '@common/auth/requests/use-resend-verification-email';
import {useSettings} from '@ui/settings/use-settings';
import {Button} from '@ui/buttons/button';
import {FormFileSizeField} from '@common/uploads/components/file-size-field';
import {LinkStyle} from '@ui/buttons/external-link';

export function UpdateUserDetailsTab() {
  const user = useOutletContext() as User;
  const form = useForm<UpdateUserPayload>({
    defaultValues: {
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      roles: user.roles,
      email_verified_at: !!user.email_verified_at,
      available_space: user.available_space,
    },
  });

  return (
    <UpdateUserForm form={form}>
      <div className="mb-24 flex gap-44">
        <FormTextField
          name="first_name"
          label={<Trans message="First name" />}
          className="flex-auto"
        />
        <FormTextField
          name="last_name"
          label={<Trans message="Last name" />}
          className="flex-auto"
        />
      </div>
      <FormFileSizeField
        className="mb-24"
        name="available_space"
        label={<Trans message="Allowed storage space" />}
        description={
          <Trans
            values={{
              a: parts => (
                <Link
                  className={LinkStyle}
                  target="_blank"
                  to="/admin/settings/uploading"
                >
                  {parts}
                </Link>
              ),
            }}
            message="Total storage space all user uploads are allowed to take up. If left empty, this value will be inherited from any roles or subscriptions user has, or from 'Available space' setting in <a>Uploading</a> settings page."
          />
        }
      />
      <EmailConfirmSection user={user} />
      <UserRoleSection />
    </UpdateUserForm>
  );
}

interface EmailConfirmSectionProps {
  user: User;
}
function EmailConfirmSection({user}: EmailConfirmSectionProps) {
  const resendConfirmationEmail = useResendVerificationEmail();
  const {require_email_confirmation} = useSettings();
  return (
    <div className="mb-44">
      <FormSwitch
        className="mb-30"
        disabled={!require_email_confirmation}
        name="email_verified_at"
        description={
          <Trans message="Whether email address has been confirmed. User will not be able to login until address is confirmed, unless confirmation is disabled from settings page." />
        }
      >
        <Trans message="Email confirmed" />
      </FormSwitch>
      <Button
        size="xs"
        variant="outline"
        color="primary"
        disabled={
          !require_email_confirmation ||
          resendConfirmationEmail.isPending ||
          !!user.email_verified_at
        }
        onClick={() => {
          resendConfirmationEmail.mutate({email: user.email});
        }}
      >
        <Trans message="Resend email" />
      </Button>
    </div>
  );
}
