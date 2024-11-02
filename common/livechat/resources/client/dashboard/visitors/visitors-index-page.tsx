import React, {Fragment, useContext} from 'react';
import {Trans} from '@ui/i18n/trans';
import visitorsSvg from '@livechat/dashboard/visitors/real-time-analytics.svg';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {
  VisitorIndexPageModel,
  visitorsIndexPageColumns,
  VisitorStatusColumn,
} from '@livechat/dashboard/visitors/visitors-index-page-columns';
import {useVisitorIndexPageFilters} from '@livechat/dashboard/visitors/visitors-index-page-filters';
import {AnimatePresence, m} from 'framer-motion';
import {
  DetailLayout,
  DetailValue,
  VisitorSidebarHeader,
} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-general-details';
import {Accordion} from '@ui/accordion/accordion';
import {TechnologyPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/technology-panel';
import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {SidebarAccordionItem} from '@livechat/dashboard/chats-page/visitor-sidebar/dashboard-chat-info-sidebar';
import {PageVisitsPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/page-visists-panel';
import {RecentChatsPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/recent-chats-panel';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useSearchParams} from 'react-router-dom';
import {DataTableContext} from '@common/datatable/page/data-table-context';
import {useNumberSearchParam} from '@common/ui/navigation/use-number-search-param';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {GroupIcon} from '@ui/icons/material/Group';
import {Avatar} from '@ui/avatar/avatar';
import {Underlay} from '@ui/overlays/underlay';

const pinnedFilters = ['status', 'assigned_to', 'group_id', 'is_returning'];

export function VisitorsIndexPage() {
  const [, setSearchParams] = useSearchParams();
  const {filters, isFiltersLoading} = useVisitorIndexPageFilters();
  return (
    <Fragment>
      <DataTablePage
        className="dashboard-stable-scrollbar min-w-0 grow"
        enableSelection={false}
        endpoint="lc/visitors"
        queryKey={['visitors']}
        skeletonsWhileLoading={10}
        title={<Trans message="Traffic" />}
        columns={visitorsIndexPageColumns}
        filters={filters}
        pinnedFilters={pinnedFilters}
        filtersLoading={isFiltersLoading}
        cellHeight="h-60"
        border="border-none"
        onRowAction={visitor => {
          setSearchParams({visitorId: visitor.id.toString()}, {replace: true});
        }}
        emptyStateMessage={
          <DataTableEmptyStateMessage
            image={visitorsSvg}
            title={<Trans message="There was no traffic recently" />}
            filteringTitle={<Trans message="No matching visitors" />}
          />
        }
      >
        <SelectedVisitorSidebar />
      </DataTablePage>
    </Fragment>
  );
}

function SelectedVisitorSidebar() {
  const {query} = useContext(DataTableContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const visitors = query.data?.pagination.data as
    | VisitorIndexPageModel[]
    | null;
  const selectedVisitorId = useNumberSearchParam('visitorId');
  const selectedVisitor = selectedVisitorId
    ? visitors?.find(v => v.id === selectedVisitorId)
    : null;

  const navigate = useNavigate();
  const [expandedItems, setExpendedItems] = useLocalStorage(
    'dash.visitors.info',
    [0],
  );

  const content = selectedVisitor ? (
    <Fragment>
      <Underlay
        isBlurred={false}
        isTransparent
        onClick={() => {
          searchParams.delete('visitorId');
          setSearchParams(searchParams, {replace: true});
        }}
      />
      <m.aside
        initial={{x: '100%', opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: '100%', opacity: 0}}
        transition={{type: 'tween', duration: 0.14, origin: 1}}
        className="fixed right-0 top-54 z-10 h-[calc(100%-54px)] w-440 max-w-full border-l bg shadow-2xl"
      >
        <IconButton
          className="absolute right-4 top-4"
          onClick={() => {
            searchParams.delete('visitorId');
            setSearchParams(searchParams, {replace: true});
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="p-20">
          <VisitorSidebarHeader visitor={selectedVisitor} />
          <DetailLayout
            label={<Trans message="Group" />}
            value={
              selectedVisitor.group ? (
                <DetailValue
                  image={
                    <Avatar label={selectedVisitor.group.name} size="xs" />
                  }
                >
                  {selectedVisitor.group.name}
                </DetailValue>
              ) : (
                <DetailValue image={<GroupIcon size="sm" />}>
                  <Trans message="Unassigned" />
                </DetailValue>
              )
            }
          />
          <DetailLayout
            label={<Trans message="Status" />}
            value={
              <VisitorStatusColumn
                visitor={selectedVisitor}
                isPlaceholder={false}
              />
            }
          />
        </div>
        <Accordion
          expandedValues={expandedItems}
          onExpandedChange={values => setExpendedItems(values as number[])}
          mode="multiple"
          key="details-accordion"
        >
          <SidebarAccordionItem label={<Trans message="Visited pages" />}>
            <PageVisitsPanel visitorId={selectedVisitor.id} />
          </SidebarAccordionItem>
          <SidebarAccordionItem label={<Trans message="Technology" />}>
            <TechnologyPanel visitor={selectedVisitor} />
          </SidebarAccordionItem>
          <SidebarAccordionItem label={<Trans message="Recent chats" />}>
            <RecentChatsPanel
              visitorId={selectedVisitor.id}
              onChatSelected={chat => {
                navigate(`/agent/chats/${chat.id}`);
              }}
            />
          </SidebarAccordionItem>
        </Accordion>
      </m.aside>
    </Fragment>
  ) : null;

  return <AnimatePresence initial={false}>{content}</AnimatePresence>;
}
