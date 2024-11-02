import {m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {Skeleton} from '@ui/skeleton/skeleton';

interface Props {
  isLoading: boolean;
  count?: number;
}
export function ChatListSkeleton({isLoading, count = 3}: Props) {
  return (
    <m.div key="chat-list-skeletons" {...opacityAnimation}>
      {Array.from({length: count}).map((_, index) => (
        <ChatListItemSkeleton key={index} isLoading={isLoading} />
      ))}
    </m.div>
  );
}

function ChatListItemSkeleton({isLoading}: Props) {
  const animation = isLoading ? 'wave' : null;
  return (
    <div className="flex gap-8 p-12">
      <Skeleton
        variant="avatar"
        radius="rounded-full"
        size="w-24 h-24"
        animation={animation}
      />
      <div className="flex-auto">
        <div className="mb-4 text-base font-semibold">
          <Skeleton className="max-w-80" animation={animation} />
        </div>
        <div className="text-[13px]">
          <Skeleton className="max-w-280" animation={animation} />
          <Skeleton className="max-w-200" animation={animation} />
        </div>
      </div>
    </div>
  );
}
