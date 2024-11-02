import React from 'react';
import softwareEngineerSvg from './software-engineer.svg';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {Trans} from '@ui/i18n/trans';
import {DeleteSelectedItemsAction} from '@common/datatable/page/delete-selected-items-action';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {Link} from 'react-router-dom';
import {TriggersDatatableColumns} from '@helpdesk/triggers/triggers-datatable-columns';

export function TriggersDatatablePage() {
  return (
    <DataTablePage
      endpoint="triggers"
      title={<Trans message="Triggers" />}
      columns={TriggersDatatableColumns}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={softwareEngineerSvg}
          title={<Trans message="No triggers have been created yet" />}
          filteringTitle={<Trans message="No matching triggers" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton elementType={Link} to="/admin/triggers/new">
      <Trans message="Add new trigger" />
    </DataTableAddItemButton>
  );
}
