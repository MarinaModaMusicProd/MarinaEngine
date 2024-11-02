import React from 'react';
import {ColumnConfig} from '@common/datatable/column-config';
import {Trans} from '@ui/i18n/trans';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {IconButton} from '@ui/buttons/icon-button';
import {EditIcon} from '@ui/icons/material/Edit';
import {FormattedNumber} from '@ui/i18n/formatted-number';
import {Link} from 'react-router-dom';
import {Trigger} from '@helpdesk/triggers/trigger';

export const TriggersDatatableColumns: ColumnConfig<Trigger>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    width: 'flex-3 min-w-200',
    header: () => <Trans message="Name" />,
    body: trigger => trigger.name,
  },
  {
    key: 'times_fired',
    allowsSorting: true,
    header: () => <Trans message="Times used" />,
    body: trigger => <FormattedNumber value={trigger.times_fired} />,
  },
  {
    key: 'updated_at',
    allowsSorting: true,
    width: 'w-100',
    header: () => <Trans message="Last updated" />,
    body: trigger => <FormattedDate date={trigger.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-42 flex-shrink-0',
    visibleInMode: 'all',
    body: trigger => (
      <IconButton
        size="md"
        className="text-muted"
        elementType={Link}
        to={`/admin/triggers/${trigger.id}/edit`}
      >
        <EditIcon />
      </IconButton>
    ),
  },
];
