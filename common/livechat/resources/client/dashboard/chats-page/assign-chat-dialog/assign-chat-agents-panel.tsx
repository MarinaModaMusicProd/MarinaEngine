import {Trans} from '@ui/i18n/trans';
import {List, ListItem} from '@ui/list/list';
import {AgentAvatarWithIndicator} from '@livechat/widget/chat/avatars/agent-avatar';
import {Group} from '@helpdesk/groups/group';
import {CompactLivechatAgent} from '@livechat/dashboard/agents/use-all-dashboard-agents';
import {Chat} from '@livechat/widget/chat/chat';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import transferImage from '@livechat/dashboard/chats-page/assign-chat-dialog/transfer.svg';
import {useIsAgentOnline} from '@livechat/dashboard/agents/use-is-agent-online';
import clsx from 'clsx';
import {useFilter} from '@ui/i18n/use-filter';

interface Props {
  groups: Group[];
  agents: CompactLivechatAgent[];
  chat: Chat;
  selectedAgentId: number | null | undefined;
  onAgentSelected: (agentId: number) => void;
  searchQuery: string;
}
export function AssignChatAgentsPanel({
  groups,
  agents,
  chat,
  selectedAgentId,
  onAgentSelected,
  searchQuery,
}: Props) {
  const {contains} = useFilter({
    sensitivity: 'base',
  });
  const group =
    groups.find(g => g.id === chat.group_id) ?? groups.find(g => g.default);
  let groupAgents = agents.filter(
    agent =>
      group && group.id === agent.groups.find(g => g.id === group.id)?.id,
  );
  if (searchQuery) {
    groupAgents = groupAgents.filter(agent =>
      contains(agent.name, searchQuery),
    );
  }
  return group && groupAgents.length ? (
    <div>
      <div>
        <Trans
          message="Agents available in ':name' group"
          values={{name: group.name}}
        />
      </div>
      <List>
        {groupAgents.map(agent => {
          const isDisabled = !agent.acceptsChats;
          return (
            <ListItem
              className={clsx(isDisabled && 'pointer-events-none opacity-80')}
              padding="p-8"
              key={agent.id}
              isSelected={selectedAgentId === agent.id}
              onSelected={() => onAgentSelected(agent.id)}
              startIcon={<AgentAvatarWithIndicator user={agent} size="md" />}
              description={<StatusMessage chat={chat} agent={agent} />}
            >
              <div>{agent.name}</div>
            </ListItem>
          );
        })}
      </List>
    </div>
  ) : (
    <NoAgentsInGroupMessage searchQuery={searchQuery} group={group} />
  );
}

interface StatusMessageProps {
  chat: Chat;
  agent: CompactLivechatAgent;
}
function StatusMessage({chat, agent}: StatusMessageProps) {
  const isOnline = useIsAgentOnline(agent.id);
  if (chat.assigned_to === agent.id) {
    return <Trans message="Chat is assigned to this agent" />;
  }
  if (!isOnline) {
    return <Trans message="Offline" />;
  }
  if (!agent.acceptsChats) {
    return <Trans message="Does not accept chats" />;
  }
  return agent.activeAssignedChatsCount ? (
    <Trans
      message="[one 1 active chat|other :count active chats]"
      values={{count: agent.activeAssignedChatsCount}}
    />
  ) : (
    <Trans message="No active chats" />
  );
}

interface NoAgentsInGroupMessageProps {
  group: Group | undefined;
  searchQuery: string;
}
function NoAgentsInGroupMessage({
  group,
  searchQuery,
}: NoAgentsInGroupMessageProps) {
  return (
    <div className="jutify-center flex h-full w-full items-center">
      <IllustratedMessage
        className="mx-auto"
        size="sm"
        image={<SvgImage src={transferImage} />}
        title={
          searchQuery ? (
            <Trans message="No agents found. Try a different search query." />
          ) : (
            <Trans
              message="No agents in :name group available for transfer."
              values={{name: group?.name ?? 'Default'}}
            />
          )
        }
      />
    </div>
  );
}
