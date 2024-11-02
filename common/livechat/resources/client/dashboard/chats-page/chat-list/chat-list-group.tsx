import {Chat} from '@livechat/widget/chat/chat';
import {ChatListItem} from '@livechat/dashboard/chats-page/chat-list/chat-list-item';
import {useParams} from 'react-router-dom';
import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {Button} from '@ui/buttons/button';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {Trans} from '@ui/i18n/trans';
import {useMemo} from 'react';
import clsx from 'clsx';
import {DashboardChatGroup} from '@livechat/dashboard/chats-page/queries/use-dashboard-chats';

interface ChatListGroupProps {
  name: DashboardChatGroup;
  chats: Chat[];
}
export function ChatListGroup({name, chats}: ChatListGroupProps) {
  const {chatId: activeChatId} = useParams();
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    `dash.${name}.collapsed`,
    false,
  );
  const [sort, setSort] = useLocalStorage<'newest' | 'oldest'>(
    `dash.${name}.sort`,
    'newest',
  );

  const sortedChats = useMemo(() => {
    chats.sort((a, b) => {
      if (sort === 'newest') {
        return a.created_at < b.created_at ? 1 : -1;
      }
      return a.created_at > b.created_at ? 1 : -1;
    });
    return chats;
  }, [chats, sort]);

  return (
    <div>
      <div className="flex items-center justify-between gap-14 p-8">
        <Button
          startIcon={
            <KeyboardArrowDownIcon
              className={clsx(
                'transition-transform',
                isCollapsed && '-rotate-90',
              )}
            />
          }
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <GroupLabel name={name} />
        </Button>
        <Button
          endIcon={<KeyboardArrowDownIcon />}
          onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
        >
          {sort === 'newest' ? (
            <Trans message="Newest" />
          ) : (
            <Trans message="Oldest" />
          )}
        </Button>
      </div>
      <div className="mx-12 space-y-4">
        {!isCollapsed &&
          sortedChats.map((chat, index) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={`${activeChatId}` === `${chat.id}`}
              className="min-h-70 rounded-panel"
            />
          ))}
      </div>
    </div>
  );
}

interface GroupLabelProps {
  name: DashboardChatGroup;
}
function GroupLabel({name}: GroupLabelProps) {
  switch (name) {
    case 'queued':
      return <Trans message="Queued" />;
    case 'unassigned':
      return <Trans message="Unassigned" />;
    case 'other':
      return <Trans message="Other" />;
    default:
      return <Trans message="My chats" />;
  }
}
