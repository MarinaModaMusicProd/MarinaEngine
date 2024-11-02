import {Trans} from '@ui/i18n/trans';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {Link, Outlet, useLocation} from 'react-router-dom';
import {CssTheme} from '@ui/themes/css-theme';
import {WidgetConfig} from '@livechat/widget/widget-config';
import {useAppearanceEditorValues} from '@common/admin/appearance/requests/use-appearance-editor-values';
import {useForm, UseFormReturn} from 'react-hook-form';
import {AppearanceEditorForm} from '@common/admin/appearance/appearance-editor-form';
import {AppearanceEditorBreadcrumb} from '@common/admin/appearance/appearance-editor-breadcrumb';
import {ThemeEditorBreadcrumb} from '@common/admin/appearance/sections/themes/theme-editor-form';

export interface ChatWidgetAppearanceFormValue {
  appearance: {
    themes: CssTheme[];
  };
  settings: {
    chatWidget: WidgetConfig;
  };
}

export function ChatWidgetAppearanceForm() {
  const values = useAppearanceEditorValues();
  const form = useForm<ChatWidgetAppearanceFormValue>({
    defaultValues: {
      appearance: {
        themes: values.appearance.themes.filter(t => t.type === 'chatWidget'),
      },
      settings: {
        chatWidget: {
          logo: values.settings.chatWidget?.logo ?? '',
          showAvatars: values.settings.chatWidget?.showAvatars ?? true,
          background: values.settings.chatWidget?.background ?? {},
          fadeBg: values.settings.chatWidget?.fadeBg ?? true,
          showHcCard: values.settings.chatWidget?.showHcCard ?? true,
          hideHomeArticles:
            values.settings.chatWidget?.hideHomeArticles ?? false,
          greeting: values.settings.chatWidget?.greeting ?? '',
          greetingAnonymous:
            values.settings.chatWidget?.greetingAnonymous ?? '',
          introduction: values.settings.chatWidget?.introduction ?? '',
          homeNewChatTitle: values.settings.chatWidget?.homeNewChatTitle ?? '',
          homeNewChatSubtitle:
            values.settings.chatWidget?.homeNewChatSubtitle ?? '',
          homeLinks: values.settings.chatWidget?.homeLinks ?? [],
          launcherIcon: values.settings.chatWidget?.launcherIcon ?? '',
          position: values.settings.chatWidget?.position ?? 'right',
          spacing: {
            side: values.settings.chatWidget?.spacing?.side ?? '16',
            bottom: values.settings.chatWidget?.spacing?.bottom ?? '16',
          },
          hide: values.settings.chatWidget?.hide ?? false,
          defaultTheme: values.settings.chatWidget?.defaultTheme ?? 'light',
          inheritThemes: values.settings.chatWidget?.inheritThemes ?? false,
          defaultScreen: values.settings.chatWidget?.defaultScreen ?? '/',
          hideNavigation: values.settings.chatWidget?.hideNavigation ?? false,
          screens: values.settings.chatWidget?.screens ?? [],
          forms: values.settings.chatWidget?.forms ?? {
            preChat: {disabled: false, elements: []},
            postChat: {disabled: false, elements: []},
          },

          // chat screen
          defaultMessage: values.settings.chatWidget?.defaultMessage ?? '',
          inputPlaceholder: values.settings.chatWidget?.inputPlaceholder ?? '',
          agentsAwayMessage:
            values.settings.chatWidget?.agentsAwayMessage ?? '',
          inQueueMessage: values.settings.chatWidget?.inQueueMessage ?? '',
        },
      },
    },
  });
  return (
    <AppearanceEditorForm
      form={form}
      breadcrumb={<ChatWidgetBreadcrumb form={form} />}
      blockerAllowedPath="chat-widget"
    >
      <Outlet />
    </AppearanceEditorForm>
  );
}

interface ChatWidgetBreadcrumbProps {
  form: UseFormReturn<ChatWidgetAppearanceFormValue>;
}
function ChatWidgetBreadcrumb({form}: ChatWidgetBreadcrumbProps) {
  const {pathname} = useLocation();

  if (pathname.includes('themes')) {
    return (
      <ThemeEditorBreadcrumb form={form}>
        <Trans message="Chat widget" />
      </ThemeEditorBreadcrumb>
    );
  }

  return (
    <AppearanceEditorBreadcrumb>
      <Trans message="Chat widget" />
      {pathname.includes('home') && <Trans message="Home screen" />}
      {pathname.includes('background') && <Trans message="Background" />}
      {pathname.includes('messages') && <Trans message="Messages" />}
      {pathname.includes('links') && <Trans message="Links" />}
      {pathname.includes('launcher') && <Trans message="Launcher" />}
      {pathname.includes('screens') && <Trans message="Screens" />}
      {pathname.includes('forms') && <Trans message="Forms" />}
      {pathname.includes('pre-chat') && <Trans message="Pre-chat" />}
      {pathname.includes('post-chat') && <Trans message="Post-chat" />}
    </AppearanceEditorBreadcrumb>
  );
}

export function ChatWidgetSectionGeneral() {
  return (
    <div>
      <AppearanceButton to="home" elementType={Link}>
        <Trans message="Home screen" />
      </AppearanceButton>
      <AppearanceButton to="chat" elementType={Link}>
        <Trans message="Chat screen" />
      </AppearanceButton>
      <AppearanceButton to="launcher" elementType={Link}>
        <Trans message="Launcher" />
      </AppearanceButton>
      <AppearanceButton to="themes" elementType={Link}>
        <Trans message="Themes" />
      </AppearanceButton>
      <AppearanceButton to="screens" elementType={Link}>
        <Trans message="Active screens" />
      </AppearanceButton>
      <AppearanceButton to="forms" elementType={Link}>
        <Trans message="Forms" />
      </AppearanceButton>
    </div>
  );
}
