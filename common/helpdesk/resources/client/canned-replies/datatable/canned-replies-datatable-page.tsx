import {Trans} from '@ui/i18n/trans';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import onlineArticlesImg from '@helpdesk/help-center/articles/article-datatable/online-articles.svg';
import {Link, useMatches} from 'react-router-dom';
import {useAuth} from '@common/auth/use-auth';
import {CannedRepliesDatatableColumns} from '@helpdesk/canned-replies/datatable/canned-replies-datatable-columns';
import {CannedRepliesDatatableFilters} from '@helpdesk/canned-replies/datatable/canned-replies-datatable-filters';
import {useNavigate} from '@common/ui/navigation/use-navigate';

export function CannedRepliesDatatablePage() {
  const navigate = useNavigate();
  const matches = useMatches();
  const {user} = useAuth();
  const forCurrentUser = matches.some(
    match => !!(match.handle as any)?.forCurrentUser,
  );
  return (
    <DataTablePage
      endpoint="helpdesk/canned-replies"
      queryKey={['canned-replies']}
      title={<Trans message="Saved replies" />}
      columns={CannedRepliesDatatableColumns}
      filters={CannedRepliesDatatableFilters}
      queryParams={{
        with: 'user',
        forUser: forCurrentUser ? user?.id : undefined,
      }}
      actions={<Actions />}
      enableSelection={false}
      onRowAction={row => navigate(`${row.id}/update`)}
      cellHeight="h-80"
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
