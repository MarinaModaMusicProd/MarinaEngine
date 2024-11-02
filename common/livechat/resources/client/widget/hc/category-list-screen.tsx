import {KeyboardArrowRightIcon} from '@ui/icons/material/KeyboardArrowRight';
import {useWidgetHcData} from '@livechat/widget/hc/use-widget-hc-data';
import {Link} from 'react-router-dom';
import {Skeleton} from '@ui/skeleton/skeleton';
import {Fragment, ReactNode} from 'react';
import {Trans} from '@ui/i18n/trans';
import clsx from 'clsx';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {Category} from '@helpdesk/help-center/categories/category';

export function CategoryListScreen() {
  const query = useWidgetHcData();
  return (
    <AnimatePresence initial={false} mode="wait">
      {query.data ? (
        <Content categories={query.data.categories} />
      ) : (
        <m.div {...opacityAnimation} key="list-skeleton">
          <CategoryListSkeleton />
        </m.div>
      )}
    </AnimatePresence>
  );
}

interface ContentProps {
  categories: Category[];
}
function Content({categories}: ContentProps) {
  return (
    <m.div {...opacityAnimation} key="category-list">
      {categories.map(category => (
        <CategoryListItem
          key={category.id}
          name={category.name}
          description={category.description}
          to={`/hc/categories/${category.id}`}
          information={
            <Trans
              message=":count articles"
              values={{
                count: category.sections!.reduce(
                  (acc, section) => acc + section.articles_count!,
                  0,
                ),
              }}
            />
          }
        />
      ))}
    </m.div>
  );
}

interface CategoryListItemProps {
  to?: string;
  name: ReactNode;
  description?: ReactNode;
  information: ReactNode;
}

export function CategoryListItem({
  to,
  name,
  description,
  information,
}: CategoryListItemProps) {
  const Element = to ? Link : 'div';
  return (
    <Element
      to={to as any}
      className={clsx('block transition-all', to && 'hover:bg-hover')}
    >
      <div className="relative ml-20 mr-14 flex items-center gap-8 border-b border-b-lighter py-16 text-sm">
        <div>
          <div className="font-semibold">{name}</div>
          {description && <div className="mt-4">{description}</div>}
          {information && <div className="mt-4 text-muted">{information}</div>}
        </div>
        {to ? <KeyboardArrowRightIcon size="sm" className="ml-auto" /> : null}
      </div>
    </Element>
  );
}

interface CategoryListSkeletonProps {
  hideInformation?: boolean;
}
export function CategoryListSkeleton({
  hideInformation,
}: CategoryListSkeletonProps) {
  return (
    <Fragment>
      <CategoryListItem
        key="skeleton-1"
        name={<Skeleton size="w-264" />}
        information={hideInformation ? null : <Skeleton size="w-68" />}
      />
      <CategoryListItem
        key="skeleton-2"
        name={<Skeleton size="w-160" />}
        information={hideInformation ? null : <Skeleton size="w-68" />}
      />
      <CategoryListItem
        key="skeleton-3"
        name={<Skeleton size="w-224" />}
        information={hideInformation ? null : <Skeleton size="w-68" />}
      />
    </Fragment>
  );
}
