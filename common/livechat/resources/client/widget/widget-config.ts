import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';
import {MenuItemConfig} from '@common/menus/menu-config';

export interface WidgetConfig {
  hide?: boolean;
  greeting?: string;
  greetingAnonymous?: string;
  introduction?: string;
  logo?: string;
  showAvatars?: boolean;
  background?: BackgroundSelectorConfig;
  fadeBg?: boolean;
  homeNewChatTitle?: string;
  homeNewChatSubtitle?: string;
  homeLinks?: MenuItemConfig[];
  showHcCard?: boolean;
  hideHomeArticles?: boolean;
  hideNavigation?: boolean;
  defaultScreen?: string;
  screens?: string[];
  launcherIcon?: string;
  defaultMessage?: string;
  inputPlaceholder?: string;
  agentsAwayMessage?: string;
  inQueueMessage?: string;
  position?: 'left' | 'right';
  spacing?: {side: string; bottom: string};
  inheritThemes?: boolean;
  defaultTheme?: 'light' | 'dark' | 'system';
}
