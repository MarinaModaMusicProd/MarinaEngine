import {Chat, ChatMessage} from '@livechat/widget/chat/chat';
import {VisitorAvatar} from '@livechat/widget/chat/avatars/visitor-avatar';
import {AgentAvatar} from '@livechat/widget/chat/avatars/agent-avatar';
import React from 'react';

interface Props {
  chat: Chat;
  message: ChatMessage;
}
export function ChatMessageAvatar({chat, message}: Props) {
  const isFromVisitor = message.author === 'visitor';
  const agent = chat.assignee ?? agents[0];
  const user = message.type !== 'event' ? message.user : agent;

  return isFromVisitor ? (
    <VisitorAvatar size="lg" visitor={conversation.visitor} user={user} />
  ) : (
    <AgentAvatar size="lg" user={user} />
  );
}
