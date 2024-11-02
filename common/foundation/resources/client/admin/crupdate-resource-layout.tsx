import {
  FieldValues,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import clsx from 'clsx';
import React, {Fragment, ReactElement, ReactNode} from 'react';
import {useStickySentinel} from '@ui/utils/hooks/sticky-sentinel';
import {Form} from '@ui/forms/form';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import {AnimatePresence, m} from 'framer-motion';

interface Props<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  form: UseFormReturn<T>;
  title: ReactNode;
  subTitle?: ReactNode;
  isLoading: boolean;
  children: ReactNode;
  actions?: ReactNode;
  backButton?: ReactNode;
  disableSaveWhenNotDirty?: boolean;
  wrapInContainer?: boolean;
  submitButtonText?: ReactNode;
  variant?: 'popup' | 'sticky';
}
export function CrupdateResourceLayout<T extends FieldValues>({
  onSubmit,
  form,
  title,
  subTitle,
  children,
  actions,
  backButton,
  isLoading = false,
  disableSaveWhenNotDirty = false,
  wrapInContainer = true,
  submitButtonText,
  variant = 'sticky',
}: Props<T>) {
  const {isSticky, sentinelRef} = useStickySentinel();
  const isDirty = !disableSaveWhenNotDirty
    ? true
    : Object.keys(form.formState.dirtyFields).length;

  const saveButton = (
    <Button
      variant="flat"
      color="primary"
      type="submit"
      disabled={isLoading || !isDirty}
    >
      {submitButtonText ?? <Trans message="Save" />}
    </Button>
  );

  return (
    <Form
      onSubmit={onSubmit}
      onBeforeSubmit={() => form.clearErrors()}
      form={form}
      className="relative"
    >
      {variant === 'sticky' && <div ref={sentinelRef} />}
      <CrupdateResourceHeader
        wrapInContainer={wrapInContainer}
        startActions={backButton}
        subTitle={subTitle}
        endActions={
          <Fragment>
            {actions}
            {variant === 'sticky' && saveButton}
          </Fragment>
        }
        className={clsx(
          isSticky && 'bg shadow',
          variant === 'sticky' && 'sticky',
        )}
      >
        {title}
      </CrupdateResourceHeader>
      <div
        className={
          wrapInContainer ? 'container mx-auto px-24 pb-24' : undefined
        }
      >
        <div className="rounded">{children}</div>
      </div>
      {variant === 'popup' && (
        <DirtyFormSaveDrawer saveButton={saveButton} isLoading={isLoading} />
      )}
    </Form>
  );
}

interface CrupdateResourceHeaderProps {
  className?: string;
  wrapInContainer?: boolean;
  children: ReactNode;
  subTitle?: ReactNode;
  startActions?: ReactNode;
  endActions?: ReactNode;
}
export function CrupdateResourceHeader({
  className,
  wrapInContainer,
  children,
  subTitle,
  startActions,
  endActions,
}: CrupdateResourceHeaderProps) {
  return (
    <div
      className={clsx('top-0 z-10 my-12 transition-shadow md:my-24', className)}
    >
      <div
        className={clsx(
          'flex items-center gap-24 py-14 md:items-start',
          wrapInContainer && 'container mx-auto px-24',
        )}
      >
        {startActions}
        <div className="overflow-hidden overflow-ellipsis md:mr-64">
          <h1 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xl md:text-3xl">
            {children}
          </h1>
          {subTitle && <div className="mt-4">{subTitle}</div>}
        </div>
        <div className="mr-auto"></div>
        {endActions}
      </div>
    </div>
  );
}

interface CrupdateResourceSectionProps {
  label: ReactElement;
  labelMargin?: string;
  children: ReactNode;
  margin?: string;
}

export function CrupdateResourceSection({
  label,
  children,
  margin = 'mb-48',
  labelMargin = 'mb-16',
}: CrupdateResourceSectionProps) {
  return (
    <section className={clsx(margin)}>
      <div className={clsx(labelMargin, 'text-lg font-semibold')}>{label}</div>
      {children}
    </section>
  );
}

interface DirtyFormSaveDrawerProps {
  saveButton?: ReactElement;
  isLoading?: boolean;
}

export function DirtyFormSaveDrawer({
  saveButton,
  isLoading,
}: DirtyFormSaveDrawerProps) {
  const {formState, reset} = useFormContext();
  return (
    <AnimatePresence>
      {formState.isDirty && (
        <Fragment>
          <div className="invisible h-92" />
          <m.div
            key="dirty-panel"
            initial={{y: 100, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 100, opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-16 border-t bg px-12 py-28 shadow-[rgba(0,0,0,0.2)_0px_0px_10px]"
          >
            <Button variant="outline" onClick={() => reset()}>
              <Trans message="Cancel" />
            </Button>
            {saveButton ?? (
              <Button
                variant="flat"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                <Trans message="Save changes" />
              </Button>
            )}
          </m.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
