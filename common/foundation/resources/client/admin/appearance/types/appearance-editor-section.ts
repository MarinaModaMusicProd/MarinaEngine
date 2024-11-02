import {RouteObject, To} from 'react-router-dom';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';

export interface AppearanceEditorBreadcrumbItem {
  label: MessageDescriptor | string;
  location?: To;
}

export interface AppearanceEditorSection {
  label: MessageDescriptor;
  position?: number;
  previewRoute?: string;
  reloadIframe?: boolean;
  config?: unknown;
  routes?: RouteObject[];
}
