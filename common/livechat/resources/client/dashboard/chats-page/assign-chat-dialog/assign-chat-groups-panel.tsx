import {Trans} from '@ui/i18n/trans';
import {List, ListItem} from '@ui/list/list';
import {Group} from '@helpdesk/groups/group';
import {CompactLivechatAgent} from '@livechat/dashboard/agents/use-all-dashboard-agents';
import {Avatar} from '@ui/avatar/avatar';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import transferImage from '@livechat/dashboard/chats-page/assign-chat-dialog/transfer.svg';
import {useFilter} from '@ui/i18n/use-filter';

interface Props {
  groups: Group[];
  agents: CompactLivechatAgent[];
  selectedGroupId: number | null | undefined;
  onGroupSelected: (groupId: number) => void;
  searchQuery: string;
}
export function AssignChatGroupsPanel({
  groups: propsGroups,
  agents,
  selectedGroupId,
  onGroupSelected,
  searchQuery,
}: Props) {
  const {contains} = useFilter({sensitivity: 'base'});
  const groups = searchQuery
    ? propsGroups.filter(g => contains(g.name, searchQuery))
    : propsGroups;

  if (!groups.length) {
    return <NoGroupsMessage searchQuery={searchQuery} />;
  }

  return (
    <List>
      {groups.map(group => {
        const availableAgents = agents.filter(
          a => a.acceptsChats && a.groups.some(g => g.id === group.id),
        );
        return (
          <ListItem
            padding="p-8"
            key={group.id}
            isSelected={selectedGroupId === group.id}
            onSelected={() => onGroupSelected(group.id)}
            startIcon={<Avatar label={group.name} />}
            description={
              availableAgents.length ? (
                <Trans
                  message="[one 1 agent|other :count agents] accepting chats"
                  values={{count: availableAgents.length}}
                />
              ) : (
                <Trans message="No agents accepting chats" />
              )
            }
          >
            <div>{group.name}</div>
          </ListItem>
        );
      })}
    </List>
  );
}

interface NoGroupsMessageProps {
  searchQuery: string;
}
function NoGroupsMessage({searchQuery}: NoGroupsMessageProps) {
  return (
    <div className="jutify-center flex h-full w-full items-center">
      <IllustratedMessage
        className="mx-auto"
        size="sm"
        image={<SvgImage src={transferImage} />}
        title={
          searchQuery ? (
            <Trans message="No groups found. Try a different search query." />
          ) : (
            <Trans message="No groups are available for transfer." />
          )
        }
      />
    </div>
  );
}
