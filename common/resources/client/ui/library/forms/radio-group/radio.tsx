import React, {ComponentPropsWithoutRef, forwardRef} from 'react';
import clsx from 'clsx';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {useController} from 'react-hook-form';
import {AutoFocusProps, useAutoFocus} from '@ui/focus/use-auto-focus';

type RadioSize = 'xs' | 'sm' | 'md' | 'lg' | undefined;

export interface RadioProps
  extends AutoFocusProps,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  display?: string;
  size?: RadioSize;
  value: string;
  invalid?: boolean;
  isFirst?: boolean;
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    children,
    autoFocus,
    size,
    invalid,
    isFirst,
    display = 'inline-flex',
    ...domProps
  } = props;

  const inputRef = useObjectRef(ref);
  useAutoFocus({autoFocus}, inputRef);

  const sizeClassNames = getSizeClassNames(size);

  return (
    <label
      className={clsx(
        'select-none items-center gap-8 whitespace-nowrap align-middle',
        display,
        sizeClassNames.label,
        props.disabled && 'pointer-events-none text-disabled',
        props.invalid && 'text-danger',
      )}
    >
      <input
        type="radio"
        className={clsx(
          'outline-none focus-visible:ring',
          'appearance-none rounded-full border-2 transition-button',
          'border-text-muted checked:border-primary checked:hover:border-primary-dark disabled:border-disabled-fg',
          'before:bg-primary before:hover:bg-primary-dark disabled:before:bg-disabled-fg',
          'before:block before:h-full before:w-full before:scale-10 before:rounded-full before:opacity-0 before:transition before:duration-200',
          'checked:before:scale-[.65] checked:before:opacity-100',
          sizeClassNames.circle,
        )}
        ref={inputRef}
        {...domProps}
      />
      {children && <span>{children}</span>}
    </label>
  );
});

export function FormRadio(props: RadioProps) {
  const {
    field: {onChange, onBlur, value, ref},
    fieldState: {invalid},
  } = useController({
    name: props.name!,
  });

  const formProps: Partial<RadioProps> = {
    onChange,
    onBlur,
    checked: props.value === value,
    invalid: props.invalid || invalid,
  };

  return <Radio ref={ref} {...mergeProps(formProps, props)} />;
}

function getSizeClassNames(size?: RadioSize): {
  circle: string;
  label: string;
} {
  switch (size) {
    case 'xs':
      return {circle: 'h-12 w-12', label: 'text-xs'};
    case 'sm':
      return {circle: 'h-16 w-16', label: 'text-sm'};
    case 'lg':
      return {circle: 'h-24 w-24', label: 'text-lg'};
    default:
      return {circle: 'h-20 w-20', label: 'text-base'};
  }
}
