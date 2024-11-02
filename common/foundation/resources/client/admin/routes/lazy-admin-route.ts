import {ComponentType} from 'react';

export const lazyAdminRoute = async (
  cmp: keyof typeof import('@app/admin/routes/app-admin-routes.lazy'),
) => {
  const exports = await import('@app/admin/routes/app-admin-routes.lazy');
  return {
    Component: exports[cmp],
  } as unknown as Promise<{Component: ComponentType}>;
};
