import {create} from 'zustand';

// "unseen" means this chat has not been seen by agent yet and
// should show a badge in sidebar menu and have title interval

// "hasUnseenMessages" means chat was seen, but has messages that were not seen yet,
// it should only show a dot in chat list item on chats page

let isWidget = false;
let isCountInWidgetTitle = false;
export function setUnseenChatsStoreIsForWidget() {
  isWidget = true;
}

interface UnseenChatsStoreState {
  chats: {id: number; unseen: boolean; hasUnseenMessages?: boolean}[];
  addChats: (
    ids: number[],
    options: {hasUnseenMessages: boolean; unseen: boolean},
  ) => void;
  clearChats: (chatsToClear?: number[]) => void;
  clearChatsWithoutUnseenMessages: (chatsToClear?: number[]) => void;
}

let intervalId: ReturnType<typeof setInterval>;

export const useUnseenChatsStore = create<UnseenChatsStoreState>()(
  (set, get) => ({
    chats: [],
    addChats: (ids, {hasUnseenMessages, unseen}) => {
      const oldChats = get().chats.filter(c => !ids.includes(c.id));
      const newChats = ids.map(id => ({
        id,
        unseen,
        hasUnseenMessages,
      }));

      set({chats: [...oldChats, ...newChats]});

      if (intervalId) clearInterval(intervalId);
      const unseenChatCount = get().chats.filter(c => c.unseen).length;
      if (unseenChatCount > 0) {
        intervalId = setInterval(() => {
          if (!isCountInTitle()) {
            addCountToTitle(unseenChatCount);
          } else {
            removeCountFromTitle();
          }
        }, 1000);
      }
    },
    clearChats: chatsToClear => {
      const currentUnseenChats = get().chats;
      chatsToClear = chatsToClear || currentUnseenChats.map(c => c.id);
      const newUnseenChats = currentUnseenChats.filter(
        chat => !chatsToClear?.includes(chat.id),
      );
      set({chats: newUnseenChats});

      maybeStopInterval();
    },
    clearChatsWithoutUnseenMessages: chatsToClear => {
      const currentUnseenChats = get().chats;
      chatsToClear = chatsToClear || currentUnseenChats.map(c => c.id);

      const newChats = [];
      for (const chat of currentUnseenChats) {
        if (!chatsToClear.includes(chat.id) || chat.hasUnseenMessages) {
          newChats.push({...chat, unseen: false});
        }
      }
      set({chats: newChats});

      maybeStopInterval();
    },
  }),
);

export function unseenChatsStore(): UnseenChatsStoreState {
  return useUnseenChatsStore.getState();
}

function maybeStopInterval() {
  // only run title interval if chat itself is unseen and not just its messages
  if (unseenChatsStore().chats.every(s => !s.unseen)) {
    if (intervalId) clearInterval(intervalId);
    removeCountFromTitle();
  }
}

function addCountToTitle(number: number) {
  if (isWidget) {
    isCountInWidgetTitle = true;
    notifyLoaderOfChanges('addCountToTitle', number);
  } else {
    if (!isCountInTitle()) {
      const prefix = `(${number}) `;
      document.title = prefix + document.title;
    }
  }
}

function removeCountFromTitle() {
  if (isWidget) {
    isCountInWidgetTitle = false;
    notifyLoaderOfChanges('removeCountFromTitle');
  } else {
    document.title = document.title.replace(/^\(\d+\)\s/, '');
  }
}

function isCountInTitle() {
  if (isWidget) {
    return isCountInWidgetTitle;
  }
  return /^\(\d+\)\s/.test(document.title);
}

function notifyLoaderOfChanges(
  action: 'removeCountFromTitle' | 'addCountToTitle',
  count?: number,
) {
  window.parent.postMessage(
    {
      source: 'livechat-widget',
      type: 'unseenChats',
      action,
      count,
    },
    '*',
  );
}
