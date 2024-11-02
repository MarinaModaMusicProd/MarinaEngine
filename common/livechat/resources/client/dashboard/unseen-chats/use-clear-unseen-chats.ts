import {useEffect} from 'react';
import {unseenChatsStore} from '@livechat/dashboard/unseen-chats/unseen-chats-store';
import {useParams} from 'react-router-dom';

export function useClearUnseenChats() {
  const {chatId} = useParams();

  useEffect(() => {
    const callback = () => {
      if (document.visibilityState === 'visible') {
        // fully clear currently active chat, and clear other chats, if they have no new messages
        if (chatId) {
          unseenChatsStore().clearChats([+chatId]);
        }
        unseenChatsStore().clearChatsWithoutUnseenMessages();
      }
    };
    // run callback immediately so chats are cleared when
    // user navigates to this page from another page
    callback();
    document.addEventListener('visibilitychange', callback);
    return () => document.removeEventListener('visibilitychange', callback);
  }, [chatId]);
}
