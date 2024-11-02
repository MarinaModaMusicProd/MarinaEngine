import {RouteObject} from 'react-router-dom';
import {notSubscribedGuard} from '@common/auth/guards/not-subscribed-route';

const lazyRoute = async (
  cmp: keyof typeof import('@common/billing/checkout/routes/checkout-routes.lazy'),
) => {
  const exports = await import(
    '@common/billing/checkout/routes/checkout-routes.lazy'
  );
  return {
    Component: exports[cmp],
  };
};

export const checkoutRoutes: RouteObject[] = [
  {
    path: 'checkout/:productId/:priceId',
    loader: () => notSubscribedGuard(),
    lazy: () => lazyRoute('Checkout'),
  },
  {
    path: 'checkout/:productId/:priceId/stripe/done',
    loader: () => notSubscribedGuard(),
    lazy: () => lazyRoute('CheckoutStripeDone'),
  },
  {
    path: 'checkout/:productId/:priceId/paypal/done',
    loader: () => notSubscribedGuard(),
    lazy: () => lazyRoute('CheckoutPaypalDone'),
  },
];
