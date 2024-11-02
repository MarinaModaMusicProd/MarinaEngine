import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {Trans} from '@ui/i18n/trans';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';
import {Chat} from '@livechat/widget/chat/chat';
import {Tabs} from '@ui/tabs/tabs';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {TabPanel, TabPanels} from '@ui/tabs/tab-panels';
import {
  CompactLivechatAgent,
  useAllDashboardAgents,
} from '@livechat/dashboard/agents/use-all-dashboard-agents';
import {useHelpdeskGroupsAutocomplete} from '@helpdesk/groups/requests/use-helpdesk-groups-autocomplete';
import {Group} from '@helpdesk/groups/group';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {Fragment, useState} from 'react';
import {AssignChatAgentsPanel} from '@livechat/dashboard/chats-page/assign-chat-dialog/assign-chat-agents-panel';
import {AssignChatGroupsPanel} from '@livechat/dashboard/chats-page/assign-chat-dialog/assign-chat-groups-panel';
import {TextField} from '@ui/forms/input-field/text-field/text-field';
import {useTrans} from '@ui/i18n/use-trans';
import {SearchIcon} from '@ui/icons/material/Search';
import {useAssignChatToAgent} from '@livechat/dashboard/chats-page/chat-feed/use-assign-chat-to-agent';
import {toast} from '@ui/toast/toast';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {useAssignChatToGroup} from '@livechat/dashboard/chats-page/chat-feed/use-assign-chat-to-group';
import {AddIcon} from '@ui/icons/material/Add';
import {Checkbox} from '@ui/forms/toggle/checkbox';
import {useSettings} from '@ui/settings/use-settings';

interface SelectedItem {
  id: number;
  type: 'agent' | 'group';
}

interface Props {
  chat: Chat;
  tab: 'agent' | 'group';
}
export function TransferChatDialog({chat, tab}: Props) {
  const {ai_setup} = useSettings();
  const {close} = useDialogContext();
  const agentQuery = useAllDashboardAgents();
  const groupQuery = useHelpdeskGroupsAutocomplete();
  const assignToAgent = useAssignChatToAgent(chat.id);
  const assignToGroup = useAssignChatToGroup(chat.id);
  const [notePanelVisible, setNotePanelVisible] = useState(false);
  const [privateNote, setPrivateNote] = useState('');
  const [shouldSummarize, setShouldSummarize] = useState(false);

  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(() => {
    if (tab === 'agent' && chat.assignee) {
      return {id: chat.assignee.id, type: 'agent'};
    }
    if (tab === 'group' && chat.group) {
      return {id: chat.group.id, type: 'group'};
    }
    return null;
  });

  const isDisabled =
    !selectedItem ||
    assignToAgent.isPending ||
    assignToGroup.isPending ||
    (selectedItem.type === 'agent' && chat.assigned_to === selectedItem.id) ||
    (selectedItem.type === 'group' && chat.group_id === selectedItem.id);

  const noteButtons = (
    <Fragment>
      <Button
        variant="outline"
        className="ml-10"
        onClick={() => {
          setNotePanelVisible(false);
          setPrivateNote('');
        }}
      >
        <Trans message="Remove note" />
      </Button>
      <Button
        variant="flat"
        color="primary"
        type="submit"
        form="private-note-form"
      >
        <Trans message="Save note" />
      </Button>
    </Fragment>
  );

  const noteForm = (
    <form
      id="private-note-form"
      onSubmit={e => {
        e.preventDefault();
        setNotePanelVisible(false);
      }}
    >
      <TextField
        label={<Trans message="Private note" />}
        autoFocus
        className="mt-34"
        inputElementType="textarea"
        rows={2}
        value={privateNote}
        onChange={e => setPrivateNote(e.target.value)}
      />
    </form>
  );

  return (
    <Dialog size="lg">
      <DialogHeader>
        <Trans message="Transfer chat" />
      </DialogHeader>
      <DialogBody>
        {agentQuery.data && groupQuery.data ? (
          <Content
            defaultTab={tab}
            agents={agentQuery.data.agents}
            groups={groupQuery.data.groups}
            chat={chat}
            selectedItem={selectedItem}
            onItemSelected={item => setSelectedItem(item)}
          />
        ) : (
          <ProgressCircle isIndeterminate />
        )}
        {notePanelVisible && noteForm}
      </DialogBody>
      <DialogFooter
        startAction={
          ai_setup ? (
            <Checkbox
              size="sm"
              checked={shouldSummarize}
              onChange={e => setShouldSummarize(e.target.checked)}
            >
              <Trans message="Summarize chat" />
            </Checkbox>
          ) : null
        }
      >
        {notePanelVisible ? (
          noteButtons
        ) : (
          <Fragment>
            <Button
              color="primary"
              startIcon={!privateNote && <AddIcon />}
              onClick={() => setNotePanelVisible(true)}
            >
              {privateNote ? (
                <Trans message="Edit private note" />
              ) : (
                <Trans message="Add private note" />
              )}
            </Button>
            <Button
              variant="flat"
              color="primary"
              disabled={isDisabled}
              onClick={() => {
                if (!selectedItem) return;

                const handleSuccess = {
                  onSuccess: () => {
                    close();
                    toast({message: 'Chat transferred'});
                  },
                };

                if (selectedItem.type === 'agent') {
                  assignToAgent.mutate(
                    {agentId: selectedItem.id, privateNote, shouldSummarize},
                    handleSuccess,
                  );
                } else if (selectedItem.type === 'group') {
                  assignToGroup.mutate(
                    {groupId: selectedItem.id, privateNote, shouldSummarize},
                    handleSuccess,
                  );
                }
              }}
            >
              <Trans message="Transfer" />
            </Button>
          </Fragment>
        )}
      </DialogFooter>
    </Dialog>
  );
}

interface ContentProps {
  defaultTab: 'agent' | 'group';
  groups: Group[];
  agents: CompactLivechatAgent[];
  chat: Chat;
  selectedItem: SelectedItem | null;
  onItemSelected: (item: SelectedItem | null) => void;
}

function Content(props: ContentProps) {
  const {trans} = useTrans();
  const [searchQuery, setSearchQuery] = useState('');
  const {defaultTab, groups, agents, chat, selectedItem, onItemSelected} =
    props;
  return (
    <Tabs
      defaultSelectedTab={defaultTab === 'agent' ? 0 : 1}
      onTabChange={() => {
        props.onItemSelected(null);
        setSearchQuery('');
      }}
    >
      <div className="flex items-center justify-between gap-14">
        <TabList>
          <Tab>
            <Trans message="Agent (:count)" values={{count: agents.length}} />
          </Tab>
          <Tab>
            <Trans message="Group (:count)" values={{count: groups.length}} />
          </Tab>
        </TabList>
        <TextField
          placeholder={trans({message: 'Search...'})}
          startAdornment={<SearchIcon />}
          size="xs"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <TabPanels className="pt-10">
        <TabPanel className="h-288 overflow-y-auto">
          <AssignChatAgentsPanel
            chat={chat}
            groups={groups}
            agents={agents}
            selectedAgentId={selectedItem?.id}
            onAgentSelected={id => onItemSelected({id, type: 'agent'})}
            searchQuery={searchQuery}
          />
        </TabPanel>
        <TabPanel className="h-288 overflow-y-auto">
          <AssignChatGroupsPanel
            groups={groups}
            agents={agents}
            selectedGroupId={selectedItem?.id}
            onGroupSelected={group =>
              onItemSelected({id: group, type: 'group'})
            }
            searchQuery={searchQuery}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
