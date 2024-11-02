import {create} from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import {Settings} from '@ui/settings/settings';
import type {IAppearanceConfig} from './types/appearance-editor-config';
import {AllCommands} from './commands/commands';
import mergedAppearanceConfig from './config/merged-appearance-config';
import {BootstrapData} from '@ui/bootstrap-data/bootstrap-data';
import {FontConfig} from '@ui/fonts/font-picker/font-config';
import {ThemeId} from '@ui/themes/theme-selector-context';

export interface AppearanceEditorValues {
  appearance: {
    env: {app_name: string; app_url: string};
    seo: {
      key: string;
      name: string;
      value: string;
      defaultValue: string;
    }[];
    themes: BootstrapData['themes'];
    custom_code: {
      css?: string;
      html?: string;
    };
  };
  settings: Settings;
}

export interface AppearanceDefaults {
  appearance: {
    themes: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
  };
  settings: Settings;
}

interface AppearanceStore {
  defaults: AppearanceDefaults | null;
  iframeWindow: Window | null;
  config: IAppearanceConfig | null;
  setDefaults: (value: AppearanceDefaults) => void;
  setIframeWindow: (value: Window) => void;
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;
  preview: {
    setValues: (settings: AppearanceEditorValues) => void;
    setThemeFont: (font: FontConfig | null) => void;
    setThemeValue: (name: string, value: string) => void;
    setActiveTheme: (themeId: ThemeId | null) => void;
    setHighlight: (selector: string | null | undefined) => void;
    setCustomCode: (mode: 'css' | 'html', value?: string) => void;
  };
}

let resolvePreviewAppIsLoaded = () => {};
export const previewAppIsLoaded = new Promise<void>(
  resolve => (resolvePreviewAppIsLoaded = resolve),
);

export const useAppearanceStore = create<AppearanceStore>()(
  subscribeWithSelector((set, get) => ({
    defaults: null,
    iframeWindow: null,
    isDirty: false,
    setIsDirty: value => {
      set(() => ({isDirty: value}));
    },
    config: mergedAppearanceConfig,
    setDefaults: value => {
      set({defaults: {...value}});
    },
    setIframeWindow: value => {
      set({iframeWindow: value});
      value.addEventListener('message', e => {
        if (
          e.data.source === 'be-appearance-preview' &&
          e.data.type === 'appLoaded'
        ) {
          resolvePreviewAppIsLoaded();
        }
      });
    },
    preview: {
      setValues: values => {
        const preview = get().iframeWindow;
        postMessage(preview, {type: 'setValues', values});
      },
      setThemeFont: font => {
        const preview = get().iframeWindow;
        postMessage(preview, {type: 'setThemeFont', value: font});
      },
      setThemeValue: (name, value) => {
        const preview = get().iframeWindow;
        postMessage(preview, {type: 'setThemeValue', name, value});
      },
      setActiveTheme: themeId => {
        const preview = get().iframeWindow!;
        postMessage(preview, {type: 'setActiveTheme', themeId});
      },
      setCustomCode: (mode, value) => {
        const preview = get().iframeWindow;
        postMessage(preview, {type: 'setCustomCode', mode, value});
      },
      setHighlight: selector => {
        let node: HTMLElement | null = null;
        const document = get().iframeWindow?.document;
        if (document && selector) {
          node = document.querySelector(selector);
        }
        if (node) {
          requestAnimationFrame(() => {
            if (!node) return;
            node.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
            });
          });
        }
      },
    },
  })),
);

function postMessage(window: Window | null, command: AllCommands) {
  if (window) {
    window.postMessage({source: 'be-appearance-editor', ...command}, '*');
  }
}

export function appearanceState(): AppearanceStore {
  return useAppearanceStore.getState();
}
