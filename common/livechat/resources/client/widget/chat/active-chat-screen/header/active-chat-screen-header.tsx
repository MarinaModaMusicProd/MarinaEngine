import {useSettings} from '@ui/settings/use-settings';
import {Avatar} from '@ui/avatar/avatar';
import {AvatarGroup} from '@ui/avatar/avatar-group';
import React, {Fragment} from 'react';
import {CompactUser} from '@ui/types/user';
import {
  useAllWidgetAgents,
  useWidgetAgentsAcceptingChats,
} from '@livechat/widget/use-all-widget-agents';
import {ActiveChatStatusMessage} from '@livechat/widget/chat/active-chat-screen/header/active-chat-status-message';
import {UseWidgetChatResponse} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';

interface Props {
  data?: UseWidgetChatResponse;
}
export function ActiveChatScreenHeader({data}: Props) {
  const agentsAcceptingChats = useWidgetAgentsAcceptingChats();
  const agent = !!data?.chat.assigned_to
    ? agentsAcceptingChats.find(agent => agent.id === data.chat.assigned_to)
    : null;

  return (
    <Fragment>
      <div>
        {agent ? <AssignedChatHeader agent={agent} /> : <AllAgentsHeader />}
      </div>
      <ActiveChatStatusMessage data={data} />
    </Fragment>
  );
}

interface AssignedChatHeaderProps {
  agent: CompactUser;
}
function AssignedChatHeader({agent}: AssignedChatHeaderProps) {
  return (
    <div className="flex flex-col items-center py-20">
      <Avatar
        size="w-46 h-46"
        src={agent.image}
        label={agent.name}
        fallback="initials"
        circle
      />
      <div className="mt-6 text-center">{agent.name}</div>
    </div>
  );
}

function AllAgentsHeader() {
  const agents = useAllWidgetAgents();
  const {chatWidget} = useSettings();
  return (
    <div className="flex justify-center py-20">
      <AvatarGroup showMore={false}>
        {chatWidget?.logo && <Avatar src={chatWidget.logo} size="lg" />}
        {agents.map(agent => (
          <Avatar
            size="lg"
            key={agent.id}
            src={agent.image}
            label={agent.name}
            fallback="initials"
          />
        ))}
      </AvatarGroup>
    </div>
  );
}
