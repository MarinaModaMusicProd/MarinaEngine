import {useQuery} from '@tanstack/react-query';
import {CssTheme} from '@ui/themes/css-theme';
import {apiClient} from '@common/http/query-client';
import {
  decodeBootstrapData,
  getBootstrapData,
} from '@ui/bootstrap-data/bootstrap-data-store';
import {Localization} from '@ui/i18n/localization';
import {Settings} from '@ui/settings/settings';
import {UseMostRecentChatResponse} from '@livechat/widget/home/use-most-recent-chat';
import type {CompactLivechatAgent} from '@livechat/dashboard/agents/use-all-dashboard-agents';

export interface WidgetBoostrapData {
  themes: {
    light: CssTheme;
    dark: CssTheme;
  };
  i18n: Localization;
  mostRecentChat: UseMostRecentChatResponse;
  settings: Settings;
  agents: CompactLivechatAgent[];
}

export function useWidgetBootstrapData() {
  return useWidgetBootstrapDataQuery().data!;
}

export function useWidgetBootstrapDataQuery() {
  return useQuery<WidgetBoostrapData>({
    queryKey: ['widget-bootstrap-data'],
    queryFn: () => fetchBootstrapData(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    initialData: () => {
      return decodeBootstrapData(
        window.bootstrapData,
      ) as unknown as WidgetBoostrapData;
    },
  });
}

export function getWidgetBootstrapData() {
  return getBootstrapData() as unknown as WidgetBoostrapData;
}

function fetchBootstrapData() {
  return apiClient
    .get<WidgetBoostrapData>(`livechat-widget-bootstrap-data`)
    .then(response => response.data);
}
