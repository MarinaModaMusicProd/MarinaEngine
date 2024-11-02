import {createBrowserRouter} from 'react-router-dom';
import {authGuard} from '@common/auth/guards/auth-route';
import React from 'react';
import {authRoutes} from '@common/auth/auth-routes';
import {notificationRoutes} from '@common/notifications/notification-routes';
import {RootErrorElement, RootRoute} from '@common/core/common-provider';
import {adminRoutes} from '@common/admin/routes/admin-routes';
import {checkoutRoutes} from '@common/billing/checkout/routes/checkout-routes';
import {billingPageRoutes} from '@common/billing/billing-page/routes/billing-page-routes';
import {commonRoutes} from '@common/core/common-routes';
import {getBootstrapData} from '@ui/bootstrap-data/bootstrap-data-store';
import {backstageRoutes} from '@app/web-player/backstage/routes/backstage-routes';
import {webPlayerRoutes} from '@app/web-player/routes/web-player-routes';

export const appRouter = createBrowserRouter(
  [
    {
      id: 'root',
      element: <RootRoute />,
      errorElement: <RootErrorElement />,
      children: [
        ...authRoutes,
        ...notificationRoutes,
        ...adminRoutes,
        ...checkoutRoutes,
        ...billingPageRoutes,
        ...commonRoutes,
        ...webPlayerRoutes,
        ...backstageRoutes,
        {
          path: 'api-docs',
          loader: () =>
            authGuard({permission: 'api.access', requireLogin: false}),
          lazy: () => import('@common/swagger/swagger-api-docs-page'),
        },
      ],
    },
  ],
  {
    basename: getBootstrapData().settings.html_base_uri,
  },
);
