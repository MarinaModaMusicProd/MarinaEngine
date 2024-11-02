import {CompactUserWithEmail} from '@ui/types/user';
import {Group} from '@helpdesk/groups/group';
import {Tag} from '@common/tags/tag';

export interface Chat {
  id: number;
  status: 'active' | 'idle' | 'closed' | 'queued' | 'unassigned';
  last_message?: ChatMessage;
  last_event?: ChatEvent;
  visitor_id: number;
  created_at: string;
  visitor?: CompactChatVisitor;
  assigned_to?: number;
  group_id?: number;
  assignee?: CompactUserWithEmail;
  group?: Group;
  tags?: Tag[];
}

interface BaseChatContentItem {
  id: number;
  conversation_id: number;
  author: 'visitor' | 'agent' | 'system' | 'bot';
  created_at: string;
  user?: CompactUserWithEmail;
  user_id?: number;
}

export interface PlaceholderChatMessage extends Omit<ChatMessage, 'id'> {
  id: string;
}

export interface ChatMessage extends BaseChatContentItem {
  type: 'message' | 'note';
  body: string;
  attachments?: ChatMessageAttachment[];
}

export interface ChatEvent extends BaseChatContentItem {
  type: 'event';
  body: {
    name:
      | 'visitor.startedChat'
      | 'closed.inactivity'
      | 'closed.byAgent'
      | 'visitor.idle'
      | 'visitor.leftChat'
      | 'agent.leftChat'
      | 'agent.changed'
      | 'group.changed';
    oldAgent?: string;
    newAgent?: string;
    newGroup?: string;
    closedBy?: string;
    status?: string;
  };
}

export interface PreChatFormData extends BaseChatContentItem {
  type: 'preChatFormData';
  body: {id: string; label: string; value: string | string[]}[];
}

export type ChatContentItem =
  | ChatMessage
  | PlaceholderChatMessage
  | ChatEvent
  | PreChatFormData;

export interface ChatMessageAttachment {
  id: number;
  type: string;
  name: string;
  file_size?: number;
  url?: string;
}

export interface CompactChatVisitor {
  id: number;
  name?: string;
  email?: string;
}

export interface ChatVisitor {
  id: number;
  user_identifier: string;
  user_ip: string;
  user?: CompactUserWithEmail;
  created_at: string;
  chats_count?: number;
  email?: string;
  name?: string;
  data: {
    //
  };
  bans?: {
    id: number;
    comment: string;
    expired_at?: string;
  }[];
  country: string;
  city: string;
  platform: string;
  browser: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'robot' | 'other';
  timezone: string;
  banned_at?: string;
}

export interface ChatVisit {
  id: number;
  created_at: string;
  ended_at?: string;
  url: string;
  title: string;
}

export interface ChatSummary {
  id: number;
  conversation_id: number;
  created_at: string;
  updated_at: string;
  content: {
    sentiment: string;
    summary: string[];
    keywords: string[];
  };
  generated_by: number;
  user?: CompactUserWithEmail;
}
