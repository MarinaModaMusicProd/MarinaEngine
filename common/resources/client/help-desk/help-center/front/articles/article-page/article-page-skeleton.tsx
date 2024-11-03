import {Skeleton} from '@ui/skeleton/skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {m} from 'framer-motion';

export function ArticlePageSkeleton() {
  return <m.div key="skeletons" {...opacityAnimation}>
    <Skeleton variant="rect" size="h-20 max-w-580"/>
    <Skeleton
      variant="rect"
      size="h-34 max-w-440"
      className="mb-30 mt-10"
    />
    <Skeleton size="w-full max-w-[95%]"/>
    <Skeleton/>
    <Skeleton size="w-full max-w-[70%]" className="mb-30 "/>
    <Skeleton size="w-full max-w-[90%]"/>
    <Skeleton size="w-full max-w-[80%]"/>
    <Skeleton size="w-full max-w-[30%]"/>
  </m.div>;
}
