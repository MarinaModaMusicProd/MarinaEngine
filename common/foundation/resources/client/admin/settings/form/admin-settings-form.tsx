import {FieldErrors, UseFormReturn, useFormState} from 'react-hook-form';
import {Fragment, ReactNode} from 'react';
import {Form} from '@ui/forms/form';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import {useUpdateAdminSettings} from '@common/admin/settings/requests/use-update-admin-settings';
import {BlockerDialog} from '@ui/overlays/dialog/blocker-dialog';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {useAdminSettings} from '@common/admin/settings/requests/use-admin-settings';
import {SettingsFormLoadingIndicator} from '@common/admin/settings/form/settings-form-loading-indicator';

interface Props {
  form: UseFormReturn<any>;
  children: ReactNode;
}
export function AdminSettingsForm({children, form}: Props) {
  const updateSettings = useUpdateAdminSettings(form);
  const {isDirty} = useFormState({control: form.control});

  return (
    <m.section key="settings-form" {...opacityAnimation}>
      <Form
        form={form}
        onBeforeSubmit={() => {
          // clear group errors, because hook form won't automatically
          // clear errors that are not bound to a specific form field
          const errors = form.formState.errors as FieldErrors<object>;
          const keys = Object.keys(errors).filter(key => {
            return key.endsWith('_group');
          });
          form.clearErrors(keys as any);
        }}
        onSubmit={values => {
          updateSettings.mutate(values, {onSuccess: () => form.reset(values)});
        }}
      >
        {children}
        <div className="mt-40">
          <Button
            type="submit"
            variant="flat"
            color="primary"
            startIcon={
              updateSettings.isPending ? (
                <ProgressCircle size="xs" isIndeterminate />
              ) : null
            }
            disabled={updateSettings.isPending || !isDirty}
          >
            <Trans message="Save changes" />
          </Button>
        </div>
      </Form>
      <BlockerDialog isBlocked={isDirty} />
    </m.section>
  );
}

interface AdminSettingsPageHeaderProps {
  children: (data: AdminSettings) => ReactNode;
  title: ReactNode;
  description: ReactNode;
  headerMargin?: string;
  // this will be used if settings page needs to load some additional data before showing
  isLoading?: boolean;
}
export function AdminSettingsLayout({
  title,
  description,
  headerMargin = 'mb-40',
  children,
  isLoading,
}: AdminSettingsPageHeaderProps) {
  const {data} = useAdminSettings();
  return (
    <Fragment>
      <div className={headerMargin}>
        <h2 className="mb-4 text-xl">{title}</h2>
        <div className="text-sm text-muted">{description}</div>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {data && !isLoading ? (
          children(data)
        ) : (
          <SettingsFormLoadingIndicator key="settings-skeleton" />
        )}
      </AnimatePresence>
    </Fragment>
  );
}
