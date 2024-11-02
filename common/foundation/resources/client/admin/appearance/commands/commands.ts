import {To} from 'react-router-dom';
import {AppearanceEditorValues} from '../appearance-store';

import {FontConfig} from '@ui/fonts/font-picker/font-config';
import {ThemeId} from '@ui/themes/theme-selector-context';

export interface AppearanceCommand {
  source: 'be-appearance-editor';
  type: string;
}

export interface Navigate {
  type: 'navigate';
  to: To;
}

export interface SetAppearanceValues {
  type: 'setValues';
  values: Partial<AppearanceEditorValues>;
}

export interface SetThemeValue {
  type: 'setThemeValue';
  name: string;
  value: string;
}

export interface SetActiveTheme {
  type: 'setActiveTheme';
  themeId: ThemeId | null;
}

export interface SetCustomCode {
  type: 'setCustomCode';
  mode: 'css' | 'html';
  value?: string;
}

export interface SetThemeFont {
  type: 'setThemeFont';
  value: FontConfig | null;
}

export type AllCommands =
  | SetAppearanceValues
  | SetThemeValue
  | SetThemeFont
  | SetActiveTheme
  | SetCustomCode;
