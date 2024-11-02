export const lazyHcRoute = async (
  cmp: keyof typeof import('@app/hc/routes/app-hc-routes.lazy'),
) => {
  const exports = await import('@app/hc/routes/app-hc-routes.lazy');
  return {
    Component: exports[cmp],
  };
};
