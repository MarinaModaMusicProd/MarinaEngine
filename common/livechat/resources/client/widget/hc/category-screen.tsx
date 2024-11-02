import {useWidgetHcData} from '@livechat/widget/hc/use-widget-hc-data';
import {useParams} from 'react-router-dom';
import {Trans} from '@ui/i18n/trans';
import {
  CategoryListItem,
  CategoryListSkeleton,
} from '@livechat/widget/hc/category-list-screen';
import {
  HelpScreenHeader,
  HelpScreenHeaderSkeleton,
} from '@livechat/widget/hc/help-screen-header';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';

export function CategoryScreen() {
  const {categoryId} = useParams();
  const query = useWidgetHcData();

  const category = query.data?.categories.find(
    category => `${category.id}` === categoryId,
  );

  return (
    <AnimatePresence initial={false} mode="wait">
      {category ? (
        <m.div {...opacityAnimation} key="category-screen">
          <HelpScreenHeader
            key="header"
            name={category.name}
            description={category.description}
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
          {category.sections?.map(section => (
            <CategoryListItem
              key={section.id}
              name={section.name}
              description={section.description}
              to={`/hc/categories/${category.id}/${section.id}`}
              information={
                <Trans
                  message=":count articles"
                  values={{count: section.articles_count!}}
                />
              }
            />
          ))}
        </m.div>
      ) : (
        <m.div {...opacityAnimation} key="category-skeleton">
          <HelpScreenHeaderSkeleton key="skeleton-header" />
          <CategoryListSkeleton key="skeleton-list" />
        </m.div>
      )}
    </AnimatePresence>
  );
}
