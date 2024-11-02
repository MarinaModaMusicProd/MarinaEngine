import {useLocation, useMatches} from 'react-router-dom';

export function usePreviousPath() {
  const location = useLocation();
  return new URL('.', window.origin + location.pathname).pathname.replace(
    /\/$/,
    '',
  );
}
