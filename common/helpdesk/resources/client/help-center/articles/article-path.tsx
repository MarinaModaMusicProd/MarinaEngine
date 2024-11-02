import {Article} from '@helpdesk/help-center/articles/article';
import {CategoryLink} from '@helpdesk/help-center/categories/category-link';
import {ReactNode} from 'react';

interface Props {
  article: {path?: Article['path']};
  className?: string;
  noLinks?: boolean;
}
export function ArticlePath({article, className, noLinks}: Props) {
  if (!article.path?.length) {
    return null;
  }

  let category: ReactNode;
  let section: ReactNode;

  if (article.path[0]) {
    category = noLinks ? (
      article.path[0].name
    ) : (
      <CategoryLink category={article.path[0]} />
    );
  }

  if (article.path[1]) {
    section = noLinks ? (
      article.path[1].name
    ) : (
      <CategoryLink category={article.path[1]} />
    );
  }

  const showSeparator = !!category && !!section;

  return (
    <div className={className}>
      {category} {showSeparator && '/'} {section}
    </div>
  );
}
