import {AppearanceEditorSection} from './appearance-editor-section';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';

export interface IAppearanceConfig {
  preview: {
    navigationRoutes: string[];
    defaultRoute?: string;
  };
  sections: Record<string, AppearanceEditorSection>;
}

export interface MenuSectionConfig {
  positions: string[];
  availableRoutes: string[];
}

export interface SeoSettingsSectionConfig {
  pages: {
    key: string;
    label: MessageDescriptor;
  }[];
}
