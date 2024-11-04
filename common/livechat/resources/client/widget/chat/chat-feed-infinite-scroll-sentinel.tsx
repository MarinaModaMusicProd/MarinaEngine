import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import clsx from 'clsx';
import {UseInfiniteQueryResult} from '@tanstack/react-query/src/types';

interface Props {
  query: UseInfiniteQueryResult;
}
export function ChatFeedInfiniteScrollSentinel({query}: Props) {
  return (
    <InfiniteScrollSentinel
      query={query}
      className={clsx('py-16', query.hasNextPage && 'h-64')}
      loaderMarginTop="m-0"
    />
  );
}
