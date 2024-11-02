import {Fragment, ReactElement, ReactNode, useEffect} from 'react';
import {Form} from '@ui/forms/form';
import {UseFormReturn, useFormState} from 'react-hook-form';
import {
  appearanceState,
  useAppearanceStore,
} from '@common/admin/appearance/appearance-store';
import {
  saveAppearanceChangesMutationKey,
  useSaveAppearanceChanges,
} from '@common/admin/appearance/requests/use-save-appearance-editor-changes';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {Link, useLocation} from 'react-router-dom';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {Trans} from '@ui/i18n/trans';
import {Button} from '@ui/buttons/button';
import {useIsMutating} from '@tanstack/react-query';
import {BlockerDialog} from '@ui/overlays/dialog/blocker-dialog';

interface Props {
  children: ReactNode;
  breadcrumb: ReactElement;
  form: UseFormReturn<any>;
  blockerAllowedPath?: string;
}
export function AppearanceEditorForm({
  children,
  breadcrumb,
  form,
  blockerAllowedPath,
}: Props) {
  const {isDirty} = useFormState({control: form.control});

  useEffect(() => {
    appearanceState().setIsDirty(isDirty);
    return () => appearanceState().setIsDirty(false);
  }, [isDirty]);

  useEffect(() => {
    const subscription = form.watch(values => {
      appearanceState().preview.setValues(values);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const saveChanges = useSaveAppearanceChanges();
  return (
    <Fragment>
      <AppearanceEditorLayout breadcrumb={breadcrumb}>
        <FileUploadProvider>
          <Form
            className="h-full flex-auto"
            id="appearance-editor"
            form={form}
            onSubmit={values => {
              saveChanges.mutate(values, {
                onSuccess: () => form.reset(values),
              });
            }}
          >
            {children}
          </Form>
        </FileUploadProvider>
      </AppearanceEditorLayout>
      <BlockerDialog isBlocked={isDirty} allowedPath={blockerAllowedPath} />
    </Fragment>
  );
}

interface AppearanceEditorLayoutProps {
  breadcrumb?: ReactNode;
  children: ReactNode;
}
export function AppearanceEditorLayout({
  breadcrumb,
  children,
}: AppearanceEditorLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <AppearanceEditorHeader />
      {breadcrumb}
      <div className="flex-auto overflow-y-auto">
        <div className="flex h-full flex-col px-14 py-20">{children}</div>
      </div>
    </div>
  );
}

function AppearanceEditorHeader() {
  const {state} = useLocation();
  const isSaving =
    useIsMutating({
      mutationKey: saveAppearanceChangesMutationKey,
    }) > 0;
  const isDirty = useAppearanceStore(s => s.isDirty);
  return (
    <div className="flex h-50 flex-shrink-0 items-center border-b pr-10">
      <IconButton
        border="border-r"
        className="text-muted"
        elementType={Link}
        to={state?.prevPath || '/admin'}
        replace
      >
        <CloseIcon />
      </IconButton>
      <div className="pl-10">
        <Trans message="Appearance editor" />
      </div>
      <Button
        variant="flat"
        color="primary"
        className="ml-auto block"
        disabled={!isDirty || isSaving}
        type="submit"
        form="appearance-editor"
      >
        {isDirty ? <Trans message="Save" /> : <Trans message="Saved" />}
      </Button>
    </div>
  );
}
