import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

interface State {
  followedUsers: number[];
  isFollowing: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
}

export const userFollowsStore = create<State>()(
  immer((set, get) => ({
    followedUsers:
      getBootstrapData().user?.followed_users?.map(u => u.id) || [],
    isFollowing: (id: number) => get().followedUsers.includes(id),
    add: (id: number) => {
      set(draft => {
        draft.followedUsers.push(id);
      });
    },
    remove: (id: number) => {
      set(draft => {
        draft.followedUsers = draft.followedUsers.filter(i => i !== id);
      });
    },
  }))
);

export const userFollows = userFollowsStore.getState;
