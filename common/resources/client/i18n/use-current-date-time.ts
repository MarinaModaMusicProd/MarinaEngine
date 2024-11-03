import {useMemo} from 'react';
import {now} from '@internationalized/date';
import {useUserTimezone} from './use-user-timezone';
import {getUserTimezone} from '@common/i18n/get-user-timezone';

export function useCurrentDateTime() {
  const timezone = useUserTimezone();
  return useMemo(() => {
    try {
      return now(timezone);
    } catch (e) {
      return now('UTC');
    }
  }, [timezone]);
}

export function getCurrentDateTime() {
  const timezone = getUserTimezone();
  try {
    return now(timezone);
  } catch (e) {
    return now('UTC');
  }
}
