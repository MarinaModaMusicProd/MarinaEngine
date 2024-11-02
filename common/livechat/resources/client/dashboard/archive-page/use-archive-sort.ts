import {useLocalStorage} from '@ui/utils/hooks/local-storage';

export function useArchiveSort() {
  return useLocalStorage<'newest' | 'oldest'>(`dash.archive.sort`, 'newest');
}
