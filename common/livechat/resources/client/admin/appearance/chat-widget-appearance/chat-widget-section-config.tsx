import {AppearanceEditorSection} from '@common/admin/appearance/types/appearance-editor-section';
import {message} from '@ui/i18n/message';
import {lazyAdminRoute} from '@common/admin/routes/lazy-admin-route';

export const ChatWidgetSectionConfig: AppearanceEditorSection = {
  label: message('Chat widget'),
  position: 1,
  previewRoute: 'widget',
  reloadIframe: true,
  routes: [
    {
      path: 'chat-widget',
      lazy: () => lazyAdminRoute('ChatWidgetAppearanceForm'),
      children: [
        {index: true, lazy: () => lazyAdminRoute('ChatWidgetSectionGeneral')},
        {
          path: 'launcher',
          lazy: () => lazyAdminRoute('ChatLauncherAppearance'),
        },
        {
          path: 'screens',
          lazy: () => lazyAdminRoute('ChatWidgetScreensConfig'),
        },
        {
          path: 'chat',
          lazy: () => lazyAdminRoute('ChatScreenAppearance'),
          handle: {previewRoute: 'chats/new'},
        },

        // home
        {
          path: 'home',
          lazy: () => lazyAdminRoute('HomeScreenGeneralAppearance'),
        },
        {
          path: 'home/background',
          lazy: () => lazyAdminRoute('HomeScreenBackgroundAppearance'),
        },
        {
          path: 'home/messages',
          lazy: () => lazyAdminRoute('HomeScreenMessagesConfig'),
        },
        {
          path: 'home/links',
          lazy: () => lazyAdminRoute('ChatWidgetCustomLinksEditor'),
        },
        {
          path: 'home/links/:menuItemIndex',
          lazy: () => lazyAdminRoute('ChatWidgetCustomLinkForm'),
        },

        // themes
        {
          path: 'themes',
          lazy: () => lazyAdminRoute('ChatWidgetThemeList'),
        },
        {
          path: 'themes/:themeIndex',
          lazy: () => lazyAdminRoute('ThemeEditor'),
        },
        {
          path: 'themes/:themeIndex/font',
          lazy: () => lazyAdminRoute('ThemeFontPanel'),
        },
        {
          path: 'themes/:themeIndex/radius',
          lazy: () => lazyAdminRoute('ThemeRadiusPanel'),
        },

        // forms
        {
          path: 'forms',
          lazy: () => lazyAdminRoute('ChatWidgetFormEditorList'),
        },
        {
          path: 'forms/pre-chat',
          lazy: () => lazyAdminRoute('PreChatFormEditor'),
          handle: {previewRoute: 'chats/new'},
        },
      ],
    },
  ],
};
