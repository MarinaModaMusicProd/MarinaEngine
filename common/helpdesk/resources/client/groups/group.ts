import {NormalizedModel} from '@ui/types/normalized-model';

export interface GroupUser extends NormalizedModel {
  id: number;
  role?: {id: number; name: string};
  chat_priority?: 'primary' | 'backup';
}

export interface Group {
  id: number;
  name: string;
  color?: string;
  users?: GroupUser[];
  chat_assignment_mode?: 'auto' | 'manual';
  default?: boolean;
}
