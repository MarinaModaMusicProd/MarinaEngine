import React, {Fragment} from 'react';
import {ChannelContentProps} from '@app/web-player/channels/channel-content';
import {TrackTable} from '@app/web-player/tracks/track-table/track-table';
import {Track} from '@app/web-player/tracks/track';
import {VirtualTableBody} from '@app/web-player/playlists/virtual-table-body';
import {ChannelHeading} from '@app/web-player/channels/channel-heading';
import {ChannelContentItem} from '@common/channels/channel';
import {useInfiniteChannelContent} from '@common/channels/requests/use-infinite-channel-content';
import clsx from 'clsx';
import {
  PaginationControls,
  PaginationControlsType,
} from '@common/ui/navigation/pagination-controls';
import {useChannelContent} from '@common/channels/requests/use-channel-content';

export function ChannelTrackTable(
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
        <InfiniteScrollTable {...props} />
      ) : (
        <PaginatedTable {...props} />
      )}
    </Fragment>
  );
}

function PaginatedTable({channel, isNested}: ChannelContentProps<Track>) {
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
      <TrackTable tracks={query.data?.data || []} enableSorting={false} />
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

function InfiniteScrollTable({channel}: ChannelContentProps<Track>) {
  const query = useInfiniteChannelContent<ChannelContentItem<Track>>(channel);

  const totalItems =
    channel.content && 'total' in channel.content
      ? channel.content.total
      : undefined;

  return (
    <TrackTable
      enableSorting={false}
      tracks={query.items}
      tableBody={<VirtualTableBody query={query} totalItems={totalItems} />}
    />
  );
}
