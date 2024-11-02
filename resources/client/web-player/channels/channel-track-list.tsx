import React, {Fragment} from 'react';
import {ChannelContentProps} from '@app/web-player/channels/channel-content';
import {Track} from '@app/web-player/tracks/track';
import {ChannelHeading} from '@app/web-player/channels/channel-heading';
import {TrackList} from '@app/web-player/tracks/track-list/track-list';
import {ChannelContentItem} from '@common/channels/channel';
import {useInfiniteChannelContent} from '@common/channels/requests/use-infinite-channel-content';
import {useChannelContent} from '@common/channels/requests/use-channel-content';
import clsx from 'clsx';
import {
  PaginationControls,
  PaginationControlsType,
} from '@common/ui/navigation/pagination-controls';

export function ChannelTrackList(
  props: ChannelContentProps<ChannelContentItem<Track>>,
) {
  const isInfiniteScroll =
    !props.isNested &&
    (!props.channel.config.paginationType ||
      props.channel.config.paginationType === 'infiniteScroll');
  return (
    <Fragment>
      <ChannelHeading {...props} />
      {isInfiniteScroll ? (
        <InfiniteScrollList {...props} />
      ) : (
        <PaginatedTrackList {...props} />
      )}
    </Fragment>
  );
}

function InfiniteScrollList({channel}: ChannelContentProps<Track>) {
  const query = useInfiniteChannelContent<ChannelContentItem<Track>>(channel);
  return <TrackList query={query} />;
}

function PaginatedTrackList({
  channel,
  isNested,
}: ChannelContentProps<ChannelContentItem<Track>>) {
  const shouldPaginate = !isNested;
  const query = useChannelContent<ChannelContentItem<Track>>(channel, null, {
    isNested,
  });

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
      <TrackList tracks={query.data?.data || []} />
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
