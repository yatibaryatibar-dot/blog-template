import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export function parseContentDate(date: unknown, fileName: string): Date {
  if (!date) {
    console.warn(`File ${fileName} is missing a date`);
    return new Date(0);
  }

  if (date instanceof Date) {
    return new Date(date.toISOString().split('T')[0]);
  }

  if (typeof date === 'string') {
    const parsedDate = dayjs(date).startOf('day').toDate();
    if (parsedDate.toString() !== 'Invalid Date') {
      return parsedDate;
    }
    console.warn(`File ${fileName} has an invalid date: ${date}`);
  } else {
    console.warn(`File ${fileName} has a non-string date`);
  }

  return new Date(0);
}
