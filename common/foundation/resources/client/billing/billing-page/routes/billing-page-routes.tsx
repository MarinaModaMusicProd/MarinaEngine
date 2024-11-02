import {RouteObject} from 'react-router-dom';
import {subscribedGuard} from '@common/auth/guards/subscribed-route';
import {PricingPage} from '@common/billing/pricing-table/pricing-page';
import React from 'react';

const lazyRoute = async (
  cmp: keyof typeof import('@common/billing/billing-page/routes/billing-page-routes.lazy'),
) => {
  const exports = await import(
    '@common/billing/billing-page/routes/billing-page-routes.lazy'
  );
  return {
    Component: exports[cmp],
  };
};

export const billingPageRoutes: RouteObject[] = [
  {
    path: 'pricing',
    element: <PricingPage />,
  },
  {
    path: 'billing',
    loader: () => subscribedGuard(),
    lazy: () => lazyRoute('BillingPageLayout'),
    children: [
      {
        index: true,
        lazy: () => lazyRoute('BillingPage'),
      },
      {
        path: 'change-payment-method',
        lazy: () => lazyRoute('ChangePaymentMethodLayout'),
        children: [
          {
            index: true,
            lazy: () => lazyRoute('ChangePaymentMethodPage'),
          },
          {
            path: 'done',
            lazy: () => lazyRoute('ChangePaymentMethodDone'),
          },
        ],
      },
      {
        path: 'change-plan',
        lazy: () => lazyRoute('ChangePlanPage'),
      },
      {
        path: 'change-plan/:productId/:priceId/confirm',
        lazy: () => lazyRoute('ConfirmPlanChangePage'),
      },
      {
        path: 'cancel',
        lazy: () => lazyRoute('ConfirmPlanCancellationPage'),
      },
      {
        path: 'renew',
        lazy: () => lazyRoute('ConfirmPlanRenewalPage'),
      },
    ],
  },
];
