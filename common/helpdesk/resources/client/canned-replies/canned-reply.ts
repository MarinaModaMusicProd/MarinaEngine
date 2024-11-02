import {User} from '@ui/types/user';
import {FileEntry} from '@common/uploads/file-entry';
import {NormalizedModel} from '@ui/types/normalized-model';

export interface CannedReply {
  id: number;
  name: string;
  body: string;
  user_id: number;
  shared: boolean;
  group_id: number;
  created_at?: string;
  updated_at?: string;
  attachments?: FileEntry[];
  tags?: NormalizedModel[];
  user?: User;
}
