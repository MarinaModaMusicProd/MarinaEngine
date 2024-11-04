import {useBootstrapDataStore} from '@ui/bootstrap-data/bootstrap-data-store';

export function useSelectedLocale() {
  const data = useBootstrapDataStore(s => s.data);
  return {
    locale: data?.i18n,
    localeCode: data?.i18n?.language || 'en',
    lines: data?.i18n?.lines,
  };
}
