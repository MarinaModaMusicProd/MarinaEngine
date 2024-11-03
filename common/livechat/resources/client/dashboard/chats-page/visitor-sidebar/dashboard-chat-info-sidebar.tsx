import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {
  Accordion,
  AccordionItem,
  AccordionItemProps,
} from '@ui/accordion/accordion';
import {Trans} from '@ui/i18n/trans';
import {DashboardChatSectionHeader} from '@livechat/dashboard/chats-page/dashboard-chat-section-header';
import React, {Fragment, useState} from 'react';
import {TechnologyPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/technology-panel';
import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {ChatGeneralDetails} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-general-details';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {PageVisitsPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/page-visists-panel';
import {AnimatePresence, m} from 'framer-motion';
import {Skeleton} from '@ui/skeleton/skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {Tabs} from '@ui/tabs/tabs';
import {RecentChatsPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/recent-chats-panel';

const tabs = {
  visitor: 0,
  hc: 1,
};

interface Props {
  query: ReturnType<typeof useDashboardChat>;
  onClose: () => void;
}
export function DashboardChatInfoSidebar({query, onClose}: Props) {
  const [activeTab, setActiveTab] = useState<number>(tabs['visitor']);
  return (
    <Fragment>
      <DashboardChatSectionHeader>
        <Tabs
          size="md"
          selectedTab={activeTab}
          onTabChange={newTab => setActiveTab(newTab)}
        >
          <TabList border="border-none">
            <Tab height="h-56">
              <Trans message="Visitor" />
            </Tab>
            <Tab height="h-56">
              <Trans message="Help center" />
            </Tab>
          </TabList>
        </Tabs>
        <IconButton className="ml-auto" onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </DashboardChatSectionHeader>
      {activeTab === tabs.visitor ? (
        <VisitorTab query={query} />
      ) : (
        <HelpCenterTab />
      )}
    </Fragment>
  );
}

interface VisitorTabProps {
  query: ReturnType<typeof useDashboardChat>;
}
function VisitorTab({query}: VisitorTabProps) {
  const [expandedItems, setExpendedItems] = useLocalStorage('dash.chat.info', [
    0,
  ]);

  return (
    <AnimatePresence initial={false} mode="wait">
      {!query.data?.visitor ? (
        <SidebarSkeleton isLoading={query.isLoading} />
      ) : (
        <m.div {...opacityAnimation} key="visitor-tab">
          <ChatGeneralDetails data={query.data} key="identity-panel" />
          <Accordion
            expandedValues={expandedItems}
            onExpandedChange={values => setExpendedItems(values as number[])}
            mode="multiple"
            key="details-accordion"
          >
            <SidebarAccordionItem label={<Trans message="Visited pages" />}>
              <PageVisitsPanel
                visitorId={query.data.visitor.id}
                initialData={query.data.visits}
              />
            </SidebarAccordionItem>
            <SidebarAccordionItem label={<Trans message="Summary" />}>
              summary
            </SidebarAccordionItem>
            <SidebarAccordionItem label={<Trans message="Addition info" />}>
              info
            </SidebarAccordionItem>
            <SidebarAccordionItem label={<Trans message="Technology" />}>
              <TechnologyPanel visitor={query.data.visitor} />
            </SidebarAccordionItem>
            <SidebarAccordionItem label={<Trans message="Recent chats" />}>
              <RecentChatsPanel
                visitorId={query.data.visitor.id}
                onChatSelected={chat => {
                  // todo: open chat in popout or modal
                }}
              />
            </SidebarAccordionItem>
          </Accordion>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export function SidebarAccordionItem(props: AccordionItemProps) {
  return (
    <AccordionItem
      {...props}
      buttonPadding="py-16 pl-24 pr-20"
      bodyPadding="p-24"
      labelClassName="font-medium"
    >
      {props.children}
    </AccordionItem>
  );
}

function HelpCenterTab() {
  return <div>help center</div>;
}

interface SidebarSkeletonProps {
  isLoading: boolean;
}
function SidebarSkeleton({isLoading}: SidebarSkeletonProps) {
  return (
    <m.div key="chat-info-sidebar-skeleton" className="mx-12 my-18">
      <div className="mb-24 flex flex-col items-center">
        <Skeleton
          variant="avatar"
          radius="rounded-full"
          size="w-42 h-42"
          className="mb-10"
          animation={isLoading ? 'wave' : null}
        />
        <Skeleton
          className="mb-2 max-w-80 text-base"
          animation={isLoading ? 'wave' : null}
        />
        <Skeleton
          className="mb-2 max-w-200 text-sm"
          animation={isLoading ? 'wave' : null}
        />
        <Skeleton
          className="max-w-160 text-sm"
          animation={isLoading ? 'wave' : null}
        />
      </div>
      <div className="mx-12">
        <Skeleton className="mb-12" animation={isLoading ? 'wave' : null} />
        <Skeleton className="mb-12" animation={isLoading ? 'wave' : null} />
        <Skeleton />
      </div>
    </m.div>
  );
}
