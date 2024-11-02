import {useArchivedChats} from '@livechat/dashboard/chats-page/queries/use-archived-chats';
import {useDashboardChat} from '@livechat/dashboard/chats-page/queries/use-dashboard-chat';
import React, {ChangeEvent, Fragment, useEffect, useRef} from 'react';
import {DashboardChatSectionHeader} from '@livechat/dashboard/chats-page/dashboard-chat-section-header';
import {Trans} from '@ui/i18n/trans';
import {AnimatePresence, m} from 'framer-motion';
import {useParams, useSearchParams} from 'react-router-dom';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import chatSvg from '@livechat/dashboard/chats-page/chat-feed/chat.svg';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {ChatListItem} from '@livechat/dashboard/chats-page/chat-list/chat-list-item';
import {ChatListSkeleton} from '@livechat/dashboard/chats-page/chat-list/chat-list-skeleton';
import {useTrans} from '@ui/i18n/use-trans';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {TextField} from '@ui/forms/input-field/text-field/text-field';
import debounce from 'just-debounce-it';
import {SearchIcon} from '@ui/icons/material/Search';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {Button} from '@ui/buttons/button';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {useArchiveSort} from '@livechat/dashboard/archive-page/use-archive-sort';
import {FilterList} from '@common/datatable/filters/filter-list/filter-list';
import {useArchivePageFilters} from '@livechat/dashboard/archive-page/archive-page-filters';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {AddFilterDialog} from '@common/datatable/filters/add-filter-dialog';
import {FilterAltIcon} from '@ui/icons/material/FilterAlt';
import {FilterListSkeleton} from '@common/datatable/filters/filter-list/filter-list-skeleton';
import {useBackendFilterUrlParams} from '@common/datatable/filters/backend-filter-url-params';
import {usePrevious} from '@ui/utils/hooks/use-previous';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';

interface Props {
  chatsQuery: ReturnType<typeof useArchivedChats>;
  activeChatQuery: ReturnType<typeof useDashboardChat>;
}
export function ArchivePageAside({chatsQuery, activeChatQuery}: Props) {
  return (
    <Fragment>
      <DashboardChatSectionHeader>
        <h1 className="text-lg font-semibold">
          <Trans message="Archive" />
        </h1>
      </DashboardChatSectionHeader>
      <AsideHeader chatsQuery={chatsQuery} />

      <div className="compact-scrollbar flex-auto overflow-y-auto">
        <AnimatePresence initial={false} mode="wait">
          <ChatsList
            chatsQuery={chatsQuery}
            activeChatQuery={activeChatQuery}
          />
        </AnimatePresence>
      </div>
    </Fragment>
  );
}

interface ChatsListProps {
  chatsQuery: ReturnType<typeof useArchivedChats>;
  activeChatQuery: ReturnType<typeof useDashboardChat>;
}
function ChatsList({chatsQuery, activeChatQuery}: ChatsListProps) {
  const {chatId: activeChatId} = useParams();
  const allChats = chatsQuery.items;
  const activeChat = activeChatQuery.data?.chat;

  // make sure active chat is always shown in left sidebar,
  // even if it does not exist in pagination
  if (activeChat && !allChats.some(chat => chat.id === activeChat.id)) {
    allChats.unshift(activeChat);
  }

  if (chatsQuery.data) {
    // no chats at all or only currently active chat is loaded
    const isEmpty =
      !allChats.length ||
      (allChats.length === 1 && `${allChats[0].id}` === activeChatId);

    if (isEmpty) {
      return (
        <IllustratedMessage
          className="mt-40"
          size="sm"
          image={<SvgImage src={chatSvg} />}
          title={<Trans message="No results found" />}
          description={
            <Trans message="Try another search query or different filters" />
          }
        />
      );
    }
    return (
      <Fragment>
        <m.div {...opacityAnimation} key="chat-list-items">
          {allChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={`${activeChatId}` === `${chat.id}`}
              className="min-h-[78px] border-b"
            />
          ))}
        </m.div>
        <InfiniteScrollSentinel query={chatsQuery} />
      </Fragment>
    );
  }

  return <ChatListSkeleton isLoading={chatsQuery.isLoading} />;
}

interface AsideHeaderProps {
  chatsQuery: ReturnType<typeof useArchivedChats>;
}
function AsideHeader({chatsQuery}: AsideHeaderProps) {
  const {trans} = useTrans();
  const {chatId} = useParams();
  const prevChatId = usePrevious(chatId);
  const inputRef = useRef<HTMLInputElement>(null!);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('query') ?? '';
  const [sort, setSort] = useArchiveSort();
  const filters = useArchivePageFilters();
  const {encodedFilters} = useBackendFilterUrlParams(filters);

  useEffect(() => {
    if (chatId && prevChatId && chatId !== prevChatId) {
      inputRef.current.value = '';
      searchParams.delete('query');
      searchParams.delete('filters');
      setSearchParams(searchParams);
    }
  }, [chatId, prevChatId, searchParams, setSearchParams]);

  const clearQueryButton = searchTerm.length ? (
    <IconButton
      onClick={() => {
        inputRef.current.value = '';
        searchParams.delete('query');
        setSearchParams(searchParams);
      }}
    >
      <CloseIcon />
    </IconButton>
  ) : null;

  return (
    <div className="flex-shrink-0 p-12">
      <form
        onSubmit={e => {
          e.preventDefault();
          searchParams.set('query', inputRef.current.value);
          setSearchParams(searchParams);
        }}
      >
        <TextField
          inputRef={inputRef}
          defaultValue={searchTerm}
          onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
            searchParams.set('query', e.target.value);
            setSearchParams(searchParams);
          }, 300)}
          startAdornment={
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          }
          endAdornment={
            chatsQuery.isPlaceholderData ? (
              <ProgressCircle isIndeterminate size="w-24 h-24" />
            ) : (
              clearQueryButton
            )
          }
          placeholder={trans({message: 'Search chats...'})}
        />
      </form>
      <div className="mt-12 flex items-center justify-between gap-12">
        <DialogTrigger type="popover">
          <Button
            variant="outline"
            startIcon={<FilterAltIcon />}
            size="xs"
            disabled={!filters.length}
          >
            <Trans message="Filter" />
          </Button>
          <AddFilterDialog filters={filters} />
        </DialogTrigger>
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
      <div className="mt-10">
        <AnimatePresence initial={false} mode="wait">
          {!filters.length && encodedFilters ? (
            <FilterListSkeleton />
          ) : (
            <m.div key="filter-list" {...opacityAnimation}>
              <FilterList filters={filters} wrap />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
