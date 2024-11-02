import type {LandingPageData} from '@helpdesk/help-center/homepage/use-hc-landing-page-data';
import type {GetArticleResponse} from '@helpdesk/help-center/articles/requests/use-article';
import {GetCategoryResponse} from '@helpdesk/help-center/categories/use-category';
import {SearchArticlesResponse} from '@helpdesk/help-center/search/use-search-articles';

export interface HcBootstrapLoaders {
  hcLandingPage?: LandingPageData;
  articlePage?: GetArticleResponse;
  updateArticle?: GetArticleResponse;
  categoryPage?: GetCategoryResponse;
  updateCategory?: GetCategoryResponse;
  searchArticles?: SearchArticlesResponse;
}
