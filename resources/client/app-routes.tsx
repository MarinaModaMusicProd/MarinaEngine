import {useSettings} from '@ui/settings/use-settings';
import {useAppearanceEditorMode} from '@common/admin/appearance/commands/use-appearance-editor-mode';
import {useAuth} from '@common/auth/use-auth';
import {Route, Routes} from 'react-router-dom';
import {ToastContainer} from '@ui/toast/toast-container';
import {EmailVerificationPage} from '@common/auth/ui/email-verification-page/email-verification-page';
import {DialogStoreOutlet} from '@ui/overlays/store/dialog-store-outlet';
import {AppearanceListener} from '@common/admin/appearance/commands/appearance-listener';
import {CookieNotice} from '@common/ui/cookie-notice/cookie-notice';
import {AuthRoute} from '@common/auth/guards/auth-route';
import React, {Fragment} from 'react';
import {FullPageLoader} from '@ui/progress/full-page-loader';
import {LandingPage} from '@app/landing-page/landing-page';
import {AuthRoutes} from '@common/auth/auth-routes';
import {BillingRoutes} from '@common/billing/billing-routes';
import {NotificationRoutes} from '@common/notifications/notification-routes';
import {ContactUsPage} from '@common/contact/contact-us-page';
import {CustomPageLayout} from '@common/custom-page/custom-page-layout';
import {NotFoundPage} from '@common/ui/not-found-page/not-found-page';
import {DynamicHomepage} from '@common/ui/other/dynamic-homepage';

const AdminRoutes = React.lazy(() => import('@common/admin/admin-routes'));
const WebPlayerRoutes = React.lazy(
  () => import('@app/web-player/web-player-routes'),
);
const BackstageRoutes = React.lazy(
  () => import('@app/web-player/backstage/backstage-routes'),
);
const SwaggerApiDocs = React.lazy(
  () => import('@common/swagger/swagger-api-docs-page'),
);

export function AppRoutes() {
  const {billing, notifications, require_email_confirmation, api, homepage} =
    useSettings();
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {user, hasPermission} = useAuth();

  if (user != null && require_email_confirmation && !user.email_verified_at) {
    return (
      <Fragment>
        <ToastContainer />
        <Routes>
          <Route path="*" element={<EmailVerificationPage />} />
        </Routes>
        <DialogStoreOutlet />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <AppearanceListener />
      <CookieNotice />
      <ToastContainer />
      <Routes>
        <Route
          path="/*"
          element={
            <AuthRoute requireLogin={false} permission="music.view">
              <React.Suspense fallback={<FullPageLoader screen />}>
                <WebPlayerRoutes />
              </React.Suspense>
            </AuthRoute>
          }
        />

        <Route
          path="backstage/*"
          element={
            <AuthRoute>
              <React.Suspense fallback={<FullPageLoader screen />}>
                <BackstageRoutes />
              </React.Suspense>
            </AuthRoute>
          }
        />
        {!homepage?.type.startsWith('channel') &&
          (user == null || isAppearanceEditorActive) && (
            <Route
              path="/"
              element={
                <DynamicHomepage homepageResolver={() => <LandingPage />} />
              }
            />
          )}
        <Route
          path="/admin/*"
          element={
            <AuthRoute permission="admin.access">
              <React.Suspense fallback={<FullPageLoader screen />}>
                <AdminRoutes />
              </React.Suspense>
            </AuthRoute>
          }
        />
        {AuthRoutes}
        {billing.enable && BillingRoutes}
        {notifications.integrated && NotificationRoutes}
        {api?.integrated && hasPermission('api.access') && (
          <Route
            path="api-docs"
            element={
              <React.Suspense fallback={<FullPageLoader screen />}>
                <SwaggerApiDocs />
              </React.Suspense>
            }
          />
        )}
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="pages/:pageSlug" element={<CustomPageLayout />} />
        <Route path="pages/:pageId/:pageSlug" element={<CustomPageLayout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <DialogStoreOutlet />
    </Fragment>
  );
}
