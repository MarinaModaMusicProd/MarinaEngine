import {Trans} from '@ui/i18n/trans';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {DeleteSelectedItemsAction} from '@common/datatable/page/delete-selected-items-action';
import onlineArticlesImg from '@helpdesk/help-center/articles/article-datatable/online-articles.svg';
import {useMemo} from 'react';
import {CannedRepliesDatatableColumns} from '@helpdesk/canned-replies/canned-replies-datatable-columns';
import {CannedRepliesDatatableFilters} from '@helpdesk/canned-replies/canned-replies-datatable-filters';
import {Link} from 'react-router-dom';

interface Props {
  userId?: number;
}
export function CannedRepliesDatatablePage({userId}: Props) {
  const {columns, filters} = useMemo(() => {
    return {
      columns: CannedRepliesDatatableColumns.filter(
        c => c.key !== 'user_id' || !userId,
      ),
      filters: CannedRepliesDatatableFilters.filter(
        f => f.key !== 'user_id' || !userId,
      ),
    };
  }, [userId]);

  return (
    <DataTablePage
      endpoint="helpdesk/canned-replies"
      title={<Trans message="Saved replies" />}
      columns={columns}
      filters={filters}
      queryParams={{
        shared: 'true',
        with: !userId ? 'user' : undefined,
        user_id: userId,
      }}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      enableSelection={false}
      cellHeight="h-76"
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={onlineArticlesImg}
          title={<Trans message="No saved replies have been created yet" />}
          filteringTitle={<Trans message="No matching replies" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton elementType={Link} to="new">
      <Trans message="Add reply" />
    </DataTableAddItemButton>
  );
}
