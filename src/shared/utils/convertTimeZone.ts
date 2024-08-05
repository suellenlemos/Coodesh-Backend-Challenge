import { toZonedTime } from 'date-fns-tz';

export const convertTimeZone = (date: Date) => {
  return toZonedTime(date, 'Etc/GMT+6');
};
