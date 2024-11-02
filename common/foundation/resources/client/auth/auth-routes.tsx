import {RegisterPage} from './ui/register-page';
import {AuthRoute} from './guards/auth-route';
import {AccountSettingsPage} from './ui/account-settings/account-settings-page';
import {GuestRoute} from './guards/guest-route';
import {ForgotPasswordPage} from './ui/forgot-password-page';
import {ResetPasswordPage} from './ui/reset-password-page';
import React from 'react';
import {RouteObject} from 'react-router-dom';
import {LoginPageWrapper} from '@common/auth/ui/login-page-wrapper';

export const authRoutes: RouteObject[] = [
  {
    path: '/register',
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPageWrapper />
      </GuestRoute>
    ),
  },
  {
    path: '/workspace/join/register',
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: '/workspace/join/login',
    element: (
      <GuestRoute>
        <LoginPageWrapper />
      </GuestRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    ),
  },
  {
    path: '/password/reset/:token',
    element: (
      <GuestRoute>
        <ResetPasswordPage />
      </GuestRoute>
    ),
  },
  {
    path: '/account-settings',
    element: (
      <AuthRoute>
        <AccountSettingsPage />
      </AuthRoute>
    ),
  },
];
