import {useSearchParams} from 'react-router-dom';

export function useNumberSearchParam(name: string): number | null {
  const [searchParams] = useSearchParams();
  const value = searchParams.get(name);
  return value ? +value : null;
}
