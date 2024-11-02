import {ContentGrid} from '@app/web-player/playable-item/content-grid';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import React, {Fragment} from 'react';
import {ChannelContentProps} from '@app/web-player/channels/channel-content';
import {ChannelContentGridItem} from '@app/web-player/channels/channel-content-grid-item';
import {ChannelHeading} from '@app/web-player/channels/channel-heading';
import {useChannelContent} from '@common/channels/requests/use-channel-content';
import {ChannelContentModel} from '@app/admin/channels/channel-content-config';
import {useInfiniteChannelContent} from '@common/channels/requests/use-infinite-channel-content';
import clsx from 'clsx';
import {
  PaginationControls,
  PaginationControlsType,
} from '@common/ui/navigation/pagination-controls';

export function ChannelContentGrid(props: ChannelContentProps) {
  const isInfiniteScroll =
    !props.isNested &&
    (!props.channel.config.paginationType ||
      props.channel.config.paginationType === 'infiniteScroll');
  return (
    <Fragment>
      <ChannelHeading {...props} />
      {isInfiniteScroll ? (
        <InfiniteScrollGrid {...props} />
      ) : (
        <PaginatedGrid {...props} />
      )}
    </Fragment>
  );
}

function PaginatedGrid({channel, isNested}: ChannelContentProps) {
  const shouldPaginate = !isNested;
  const query = useChannelContent(channel, null, {isNested});

  return (
    <div
      className={clsx(
        'transition-opacity',
        query.isPlaceholderData && 'opacity-70',
      )}
    >
      {shouldPaginate && (
        <PaginationControls
          pagination={query.data}
          type={channel.config.paginationType as PaginationControlsType}
          className="mb-24"
        />
      )}
      <ContentGrid>
        {query.data?.data.map(item => (
          <ChannelContentGridItem
            key={`${item.id}-${item.model_type}`}
            item={item}
            items={query.data?.data}
          />
        ))}
      </ContentGrid>
      {shouldPaginate && (
        <PaginationControls
          pagination={query.data}
          type={channel.config.paginationType as PaginationControlsType}
          className="mt-24"
          scrollToTop
        />
      )}
    </div>
  );
}

function InfiniteScrollGrid({channel}: ChannelContentProps) {
  const query = useInfiniteChannelContent<ChannelContentModel>(channel);
  return (
    <div>
      <ContentGrid>
        {query.items.map(item => (
          <ChannelContentGridItem
            key={`${item.id}-${item.model_type}`}
            item={item}
            items={query.items}
          />
        ))}
      </ContentGrid>
      <InfiniteScrollSentinel query={query} />
    </div>
  );
}
