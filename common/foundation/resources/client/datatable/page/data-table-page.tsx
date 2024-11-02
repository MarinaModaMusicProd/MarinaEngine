import React, {ReactElement, ReactNode, useId} from 'react';
import {TableDataItem} from '../../ui/tables/types/table-data-item';
import {DataTable, DataTableProps} from '../data-table';
import {TableProps} from '../../ui/tables/table';
import {StaticPageTitle} from '../../seo/static-page-title';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';
import clsx from 'clsx';

interface Props<T extends TableDataItem> extends DataTableProps<T> {
  title?: ReactElement<MessageDescriptor>;
  headerContent?: ReactNode;
  headerItemsAlign?: string;
  enableSelection?: boolean;
  onRowAction?: TableProps<T>['onAction'];
  padding?: string;
  className?: string;
  variant?: 'default' | 'fullPage';
}
export function DataTablePage<T extends TableDataItem>({
  title,
  headerContent,
  headerItemsAlign = 'items-end',
  className,
  padding,
  variant,
  ...dataTableProps
}: Props<T>) {
  const titleId = useId();

  return (
    <div
      className={clsx(
        padding ?? variant === 'fullPage' ? 'p-0' : 'p-12 md:p-24',
        className,
      )}
    >
      {title && (
        <div
          className={clsx(
            variant === 'fullPage' ? 'mb-6 border-b px-24 py-12' : 'mb-16',
            headerContent && `flex ${headerItemsAlign} gap-4`,
          )}
        >
          <StaticPageTitle>{title}</StaticPageTitle>
          <h1 className="text-3xl font-light first:capitalize" id={titleId}>
            {title}
          </h1>
          {headerContent}
        </div>
      )}
      <div className={clsx(variant === 'fullPage' ? 'p-12 md:p-24' : 'p-0')}>
        <DataTable
          {...dataTableProps}
          tableDomProps={{
            'aria-labelledby': title ? titleId : undefined,
          }}
        />
      </div>
    </div>
  );
}
