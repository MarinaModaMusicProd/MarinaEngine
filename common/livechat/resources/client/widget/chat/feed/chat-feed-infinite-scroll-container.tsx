import {ReactNode, useEffect, useRef} from 'react';
import {getScrollParent} from '@react-aria/utils';

interface Props {
  totalPages: number;
  index: number;
  children: ReactNode;
  className?: string;
}
export function ChatFeedInfiniteScrollContainer({
  index,
  totalPages,
  children,
  className,
}: Props) {
  // if it's the current page that is not lazy loaded, scroll to the bottom whenever height changes
  const isLastPage = index === totalPages - 1;
  const lastPageRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number | null>(null);
  useEffect(() => {
    if (!lastPageRef.current) return;

    const el = lastPageRef.current;
    const scrollParent = getScrollParent(el);
    const observer = new ResizeObserver(e => {
      const newHeight = e[0].contentRect.height;
      if (newHeight !== prevHeightRef.current) {
        scrollParent.scrollTop = scrollParent.scrollHeight;
        prevHeightRef.current = newHeight;
      }
    });
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  // if it's a lazy-loaded page, adjust scroll position, otherwise it will always stay at 0
  const isFirstPage = index === 0;
  const lazyLoadedPageRef = useRef<HTMLDivElement>(null);
  const alreadyAdjustedScrollAfterLazyLoad = useRef(false);
  useEffect(() => {
    if (
      !lazyLoadedPageRef.current ||
      totalPages < 2 ||
      !isFirstPage ||
      alreadyAdjustedScrollAfterLazyLoad.current
    ) {
      return;
    }

    const scrollParent = getScrollParent(lazyLoadedPageRef.current);

    scrollParent.scrollTop =
      lazyLoadedPageRef.current.getBoundingClientRect().height;
    alreadyAdjustedScrollAfterLazyLoad.current = true;
  }, [totalPages, isFirstPage]);

  return (
    <div
      className={className}
      ref={isLastPage ? lastPageRef : lazyLoadedPageRef}
    >
      {children}
    </div>
  );
}
