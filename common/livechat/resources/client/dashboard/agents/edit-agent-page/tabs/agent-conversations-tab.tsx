import {useAgentConversations} from '@livechat/dashboard/agents/use-agent-conversations';
import React, {Fragment} from 'react';
import {DashboardConversationList} from '@livechat/dashboard/chats-page/dashboard-conversation-list';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {Trans} from '@ui/i18n/trans';
import chatSvg from '@livechat/dashboard/chats-page/chat-feed/chat.svg';
import {SvgImage} from '@ui/images/svg-image';

export function AgentConversationsTab() {
  const query = useAgentConversations();
  const navigate = useNavigate();

  if (query.noResults) {
    return (
      <IllustratedMessage
        className="mt-60"
        image={<SvgImage src={chatSvg} />}
        title={
          <Trans message="Agent did not have any conversations recently" />
        }
      />
    );
  }

  return (
    <Fragment>
      <DashboardConversationList
        conversations={query.items}
        onSelected={chat => {
          const page = chat.status === 'closed' ? 'archive' : 'chats';
          navigate(`/agent/${page}/${chat.id}`);
        }}
      />
      <InfiniteScrollSentinel query={query} />
    </Fragment>
  );
}
