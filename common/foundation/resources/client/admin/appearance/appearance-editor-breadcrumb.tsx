import {Link} from 'react-router-dom';
import clsx from 'clsx';
import React, {Children, Fragment, ReactElement, ReactNode} from 'react';
import {KeyboardArrowRightIcon} from '@ui/icons/material/KeyboardArrowRight';
import {Trans} from '@ui/i18n/trans';
import {IconButton} from '@ui/buttons/icon-button';
import {KeyboardArrowLeftIcon} from '@ui/icons/material/KeyboardArrowLeft';
import {usePreviousPath} from '@common/ui/navigation/use-previous-path';

interface Props {
  children: ReactNode;
  backLink?: string;
}
export function AppearanceEditorBreadcrumb({children, backLink}: Props) {
  const childrenArray = Children.toArray(children) as ReactElement[];
  const previousPath = usePreviousPath();

  const categories = [<Trans key="mainLabel" message="Customizing" />];
  if (childrenArray.length > 1) {
    categories.push(childrenArray[0]);
  }
  const sections =
    childrenArray.length > 1 ? childrenArray.slice(1) : childrenArray;

  return (
    <div className="flex h-60 flex-shrink-0 items-center border-b">
      <IconButton
        iconSize="md"
        radius="rounded-none"
        className="h-full w-50 flex-shrink-0 text-muted"
        elementType={Link}
        to={backLink ?? previousPath}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <div className="min-w-0 border-l p-10">
        <LabelList items={categories} className="text-xs text-muted" />
        <LabelList items={sections} isEmphasized className="mt-2 text-sm" />
      </div>
    </div>
  );
}

interface LabelListProps {
  items: ReactElement[];
  className: string;
  isEmphasized?: boolean;
}
function LabelList({items, className, isEmphasized}: LabelListProps) {
  return (
    <div className={clsx('flex items-center gap-4', className)}>
      {items.map((item, index) => {
        const isLast = items.length - 1 === index;
        return (
          <Fragment key={index}>
            <div
              className={clsx(
                'min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap',
                isLast && isEmphasized && 'text-primary',
              )}
            >
              {item}
            </div>
            {!isLast &&
              (isEmphasized ? (
                <KeyboardArrowRightIcon
                  className="flex-shrink-0 text-muted"
                  size="font-inherit"
                />
              ) : (
                <div>&bull;</div>
              ))}
          </Fragment>
        );
      })}
    </div>
  );
}
