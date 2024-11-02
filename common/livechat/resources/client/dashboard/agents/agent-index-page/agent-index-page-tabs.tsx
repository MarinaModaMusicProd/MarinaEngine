import {Tabs} from '@ui/tabs/tabs';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {Trans} from '@ui/i18n/trans';
import React from 'react';
import {Link} from 'react-router-dom';
import {useUrlBackedTabs} from '@common/http/use-url-backed-tabs';

const tabConfig = [
  {uri: 'agents', label: {message: 'Active'}},
  {uri: 'invited-agents', label: {message: 'Invited agents'}},
];

export function AgentIndexPageTabs() {
  const [activeTab, setActiveTab] = useUrlBackedTabs(tabConfig);
  return (
    <Tabs selectedTab={activeTab} onTabChange={setActiveTab}>
      <TabList className="px-24">
        <Tab elementType={Link} to="../agents">
          <Trans message="Active" />
        </Tab>
        <Tab elementType={Link} to="../invited-agents">
          <Trans message="Invited" />
        </Tab>
      </TabList>
    </Tabs>
  );
}
