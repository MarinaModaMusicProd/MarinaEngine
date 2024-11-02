import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Category} from '@helpdesk/help-center/categories/category';

interface WidgetHcDataResponse {
  categories: Category[];
}

export function useWidgetHcData() {
  return useQuery({
    queryKey: ['articles', 'widget', 'hcData'],
    queryFn: () => fetchData(),
  });
}

async function fetchData() {
  return apiClient
    .get<WidgetHcDataResponse>(`lc/widget/help-center-data`, {})
    .then(response => response.data);
}
