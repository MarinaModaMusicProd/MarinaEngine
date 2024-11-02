import {User} from '@ui/types/user';
import {NormalizedModel} from '@ui/types/normalized-model';

export interface AgentSettings {
  chat_limit: number;
  accepts_chats: 'yes' | 'no' | 'workingHours';
  working_hours: Record<
    string,
    {from: string; to: string; enable?: boolean}
  > | null;
}

export interface CompactAgent {
  id: number;
  name: string;
  email: string;
  roles?: NormalizedModel[];
  banned_at?: string;
  agent_settings?: AgentSettings;
}

export interface FullAgent extends User {
  agent_settings: AgentSettings;
  groups: NormalizedModel[];
}
