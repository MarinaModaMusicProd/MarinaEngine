import {RouteObject} from 'react-router-dom';
import {lazyHcRoute} from '@helpdesk/help-center/routes/lazy-hc-route';

export const hcRoutes: RouteObject[] = [
  {
    index: true,
    lazy: () => lazyHcRoute('HcLandingPage'),
  },
  {
    path: 'articles/:articleId/:articleSlug',
    lazy: () => lazyHcRoute('ArticlePage'),
  },
  {
    path: 'articles/:categoryId/:sectionId/:articleId/:articleSlug',
    lazy: () => lazyHcRoute('ArticlePage'),
  },
  {
    path: 'categories/:categoryId/:sectionId/:slug',
    lazy: () => lazyHcRoute('CategoryPage'),
  },
  {
    path: 'categories/:categoryId/:slug',
    lazy: () => lazyHcRoute('CategoryPage'),
  },
  {
    path: 'search/:query',
    lazy: () => lazyHcRoute('HcSearchPage'),
  },
];
