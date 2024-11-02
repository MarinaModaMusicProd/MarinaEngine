import {UseMostRecentChatResponse} from '@livechat/widget/home/use-most-recent-chat';
import {useSettings} from '@ui/settings/use-settings';
import {useTrans} from '@ui/i18n/use-trans';
import {useAllWidgetAgents} from '@livechat/widget/use-all-widget-agents';
import {getCurrentDateTime} from '@ui/i18n/use-current-date-time';
import {HomeScreenCardLayout} from '@livechat/widget/home/home-screen-card-layout';
import {Link} from 'react-router-dom';
import {Trans} from '@ui/i18n/trans';
import {AgentAvatarWithIndicator} from '@livechat/widget/chat/avatars/agent-avatar';
import {BulletSeparatedItems} from '@common/ui/other/bullet-seprated-items';
import {FormattedRelativeTime} from '@ui/i18n/formatted-relative-time';
import {KeyboardArrowRightIcon} from '@ui/icons/material/KeyboardArrowRight';
import React from 'react';
import {ChatContentItem, ChatVisitor} from '@livechat/widget/chat/chat';
import {VisitorAvatar} from '@livechat/widget/chat/avatars/visitor-avatar';
import {UnseenMessagesBadge} from '@livechat/dashboard/unseen-chats/unseen-messages-badge';

interface Props {
  data: Required<UseMostRecentChatResponse>;
}
export function ResumeChatCard({data}: Props) {
  const {chatWidget} = useSettings();
  const {trans} = useTrans();
  const lastMsg = data.messages.data.at(-1);
  if (!lastMsg) return null;

  const lastMsgText =
    lastMsg?.type === 'message'
      ? lastMsg.body
      : trans({message: chatWidget?.defaultMessage ?? ''});
  const lastMsgDate =
    lastMsg?.created_at ?? getCurrentDateTime().toAbsoluteString();

  return (
    <HomeScreenCardLayout>
      <div className="px-20 py-16 transition-button hover:bg-hover dark:bg-alt">
        <Link to={`/chats/${data.chat.id}`} className="block">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div className="font-semibold">
              <Trans message="Recent message" />
            </div>
            <UnseenMessagesBadge chatId={data.chat.id} className="ml-auto" />
          </div>
          <div className="flex items-center gap-8">
            <MessageAvatar message={lastMsg} visitor={data.visitor} />
            <div className="min-w-0 flex-auto overflow-hidden">
              <BulletSeparatedItems className="text-xs text-muted">
                <MessageAuthorName message={lastMsg} visitor={data.visitor} />
                <div>
                  <FormattedRelativeTime date={lastMsgDate} style="narrow" />
                </div>
              </BulletSeparatedItems>
              <div className="text-sm">{lastMsgText}</div>
            </div>
            <KeyboardArrowRightIcon className="text-primary" size="sm" />
          </div>
        </Link>
      </div>
    </HomeScreenCardLayout>
  );
}

interface MessageAvatarProps {
  message: ChatContentItem;
  visitor: ChatVisitor;
}
function MessageAvatar({message, visitor}: MessageAvatarProps) {
  const agents = useAllWidgetAgents();

  if (message.author === 'visitor') {
    return <VisitorAvatar visitor={visitor} user={message.user} size="lg" />;
  }

  const agent = agents.find(a => a.id === message.user_id) ?? agents[0];

  return <AgentAvatarWithIndicator user={agent} size="lg" showAwayIcon />;
}

function MessageAuthorName({message, visitor}: MessageAvatarProps) {
  const agents = useAllWidgetAgents();
  if (message.author === 'visitor') {
    return <Trans message="You" />;
  }
  const agent = agents.find(a => a.id === message.user_id) ?? agents[0];
  return <div>{agent.name}</div>;
}
