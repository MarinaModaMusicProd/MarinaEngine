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
import {
  ChatGeneralDetails,
  DetailLayout,
} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-general-details';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import {PageVisitsPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/page-visists-panel';
import {AnimatePresence, m} from 'framer-motion';
import {Skeleton} from '@ui/skeleton/skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {Tabs} from '@ui/tabs/tabs';
import {RecentChatsPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/recent-chats-panel';
import {useSearchParams} from 'react-router-dom';
import {ChatSummaryPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-summary-panel/chat-summary-panel';
import {useSettings} from '@ui/settings/use-settings';
import {PreChatFormDataPanel} from '@livechat/dashboard/chats-page/visitor-sidebar/pre-chat-form-data-panel';

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
  const {ai_setup} = useSettings();
  const [, setSearchParams] = useSearchParams();
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
            {query.data?.preChatFormData && (
              <SidebarAccordionItem label={<Trans message="Pre-chat form" />}>
                <PreChatFormDataPanel data={query.data.preChatFormData} />
              </SidebarAccordionItem>
            )}
            <SidebarAccordionItem label={<Trans message="Visited pages" />}>
              <PageVisitsPanel
                visitorId={query.data.visitor.id}
                initialData={query.data.visits}
              />
            </SidebarAccordionItem>
            {ai_setup && (
              <SidebarAccordionItem label={<Trans message="Summary" />}>
                <ChatSummaryPanel initialData={query.data.summary} />
              </SidebarAccordionItem>
            )}
            <SidebarAccordionItem label={<Trans message="Technology" />}>
              <TechnologyPanel visitor={query.data.visitor} />
            </SidebarAccordionItem>
            <SidebarAccordionItem label={<Trans message="Recent chats" />}>
              <RecentChatsPanel
                visitorId={query.data.visitor.id}
                onChatSelected={chat => {
                  setSearchParams(
                    {previewChatId: `${chat.id}`},
                    {replace: true},
                  );
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
    <m.div key="chat-info-sidebar-skeleton" className="m-20">
      <div className="mb-12 flex items-center gap-12 border-b pb-18">
        <Skeleton
          variant="avatar"
          radius="rounded-full"
          size="w-64 h-64"
          animation={isLoading ? 'wave' : null}
        />
        <div className="flex-auto">
          <Skeleton
            className="mb-2 max-w-80 text-base"
            animation={isLoading ? 'wave' : null}
          />
          <Skeleton
            className="max-w-200 text-sm"
            animation={isLoading ? 'wave' : null}
          />
          <Skeleton
            className="max-w-160 text-sm"
            animation={isLoading ? 'wave' : null}
          />
        </div>
      </div>
      <DetailLayout
        label={
          <Skeleton
            className="min-h-24 max-w-70 text-sm"
            animation={isLoading ? 'wave' : null}
          />
        }
        value={
          <Skeleton
            className="max-w-110"
            animation={isLoading ? 'wave' : null}
          />
        }
      />
      <DetailLayout
        label={
          <Skeleton
            className="min-h-24 max-w-50 text-sm"
            animation={isLoading ? 'wave' : null}
          />
        }
        value={
          <Skeleton
            className="max-w-80"
            animation={isLoading ? 'wave' : null}
          />
        }
      />
    </m.div>
  );
}
