import {Permission} from '../../auth/permission';

export interface WorkspaceMember {
  id: number;
  member_id: number;
  email: string;
  role_name: string;
  role_id: number;
  image: string;
  name: string;
  model_type: 'member';
  is_owner: boolean;
  permissions?: Permission[];
}
