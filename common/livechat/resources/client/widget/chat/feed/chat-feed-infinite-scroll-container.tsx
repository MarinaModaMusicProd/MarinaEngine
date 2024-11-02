import {ReactNode, useLayoutEffect, useMemo, useRef} from 'react';
import {PaginationResponse} from '@common/http/backend-response/pagination-response';
import {usePrevious} from '@ui/utils/hooks/use-previous';
import {getScrollParent} from '@react-aria/utils';

interface Props {
  children: ReactNode;
  className?: string;
  data?: {pagination: PaginationResponse<any>}[];
}
export function ChatFeedInfiniteScrollContainer({
  children,
  className,
  data,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);

  // generate key string from message ids. This will ensure effect only reruns if
  // there are new ids or order changed, while object reference changes will not have any effect
  const key = useMemo(
    () => data?.map(d => d.pagination.data.map(d => d.id)).join(','),
    [data],
  );
  const pageCount = data?.length || 0;
  const prevKey = usePrevious(key);
  const prevPageCount = usePrevious(data?.length);
  const prevHeight = useRef<number>();

  useLayoutEffect(() => {
    if (key === prevKey || !pageCount || !elRef.current) return;

    // if there's more than one page, and page count is different from previous count,
    // we can assume change was due to lazy loading, and we should adjust scroll position
    // according to previous height, otherwise change was due to new message
    // added or initial load, so just scroll to the bottom
    const isLazyLoad =
      pageCount > 1 && prevPageCount && prevPageCount < pageCount;
    const scrollParent = getScrollParent(elRef.current);
    const scrollHeight = scrollParent.scrollHeight;

    if (isLazyLoad) {
      scrollParent.scrollTop =
        elRef.current.getBoundingClientRect().height -
        (prevHeight.current || 0);
    } else {
      scrollParent.scrollTop = scrollHeight;
    }

    prevHeight.current = scrollHeight;
  }, [key, prevKey, pageCount, prevPageCount]);

  return (
    <div className={className} ref={elRef} id="asdasdd">
      {children}
    </div>
  );
}
