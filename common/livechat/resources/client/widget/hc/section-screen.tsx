import {useWidgetHcData} from '@livechat/widget/hc/use-widget-hc-data';
import {Link, useParams} from 'react-router-dom';
import {Trans} from '@ui/i18n/trans';
import {KeyboardArrowRightIcon} from '@ui/icons/material/KeyboardArrowRight';
import {getArticleLink} from '@helpdesk/help-center/articles/article-link';
import {
  HelpScreenHeader,
  HelpScreenHeaderSkeleton,
} from '@livechat/widget/hc/help-screen-header';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {CategoryListSkeleton} from '@livechat/widget/hc/category-list-screen';
import {Article} from '@helpdesk/help-center/articles/article';
import {Section} from '@helpdesk/help-center/categories/category';

export function SectionScreen() {
  const {categoryId, sectionId} = useParams();
  const query = useWidgetHcData();

  const category = query.data?.categories.find(
    category => `${category.id}` === categoryId,
  );
  const section = category?.sections?.find(
    section => `${section.id}` === sectionId,
  );

  return (
    <AnimatePresence initial={false} mode="wait">
      {section ? (
        <m.div {...opacityAnimation} key="section">
          <HelpScreenHeader
            key="header"
            name={section.name}
            description={section.description}
            information={
              <Trans
                message=":count articles"
                values={{
                  count: section.articles_count!,
                }}
              />
            }
          />
          {section.articles?.map(article => (
            <ArticleListItem
              key={article.id}
              article={article}
              section={section}
            />
          ))}
        </m.div>
      ) : (
        <m.div {...opacityAnimation} key="section-skeleton">
          <HelpScreenHeaderSkeleton key="skeleton-header" />
          <CategoryListSkeleton key="skeleton-list" hideInformation />
        </m.div>
      )}
    </AnimatePresence>
  );
}

interface ArticleListItemProps {
  article: Article;
  section?: Section;
}
export function ArticleListItem({article, section}: ArticleListItemProps) {
  return (
    <Link
      key={article.id}
      to={getArticleLink(article, {section})}
      className="block transition-all hover:bg-hover"
    >
      <div className="relative ml-20 mr-14 flex items-center gap-8 py-16 text-sm">
        <div>{article.title}</div>
        <KeyboardArrowRightIcon size="sm" className="ml-auto" />
      </div>
    </Link>
  );
}
