import {useLocation} from 'react-router-dom';

export function useIsArchivePage(): boolean {
  const {pathname} = useLocation();
  return pathname.includes('archive');
}
