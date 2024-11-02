import {RouteObject} from 'react-router-dom';
import {ContactUsPage} from '@common/contact/contact-us-page';
import {CustomPageLayout} from '@common/custom-page/custom-page-layout';
import {NotFoundPage} from '@common/ui/not-found-page/not-found-page';
import React from 'react';

export const commonRoutes: RouteObject[] = [
  {
    path: 'contact',
    element: <ContactUsPage />,
  },
  {
    path: 'pages/:pageSlug',
    element: <CustomPageLayout />,
  },
  {
    path: 'pages/:pageId/:pageSlug',
    element: <CustomPageLayout />,
  },
  {
    path: '404',
    element: <NotFoundPage />,
  },
];
