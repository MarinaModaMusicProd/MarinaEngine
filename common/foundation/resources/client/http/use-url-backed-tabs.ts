import {useLocation} from 'react-router-dom';
import {useState} from 'react';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';

export interface UrlBackedTabConfig {
  uri: string;
  label: MessageDescriptor;
}

export function useUrlBackedTabs(config: UrlBackedTabConfig[]) {
  const {pathname} = useLocation();
  const tabName = pathname.split('/').pop();
  return useState(() => {
    const index = config.findIndex(tab => tab.uri === tabName);
    return index === -1 ? 0 : index;
  });
}
