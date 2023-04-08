import 'intl';
import 'date-time-format-timezone';
import 'intl/locale-data/jsonp/en';
import { addMilliseconds } from 'date-fns';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import addMonths from 'date-fns/addMonths';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInMonths from 'date-fns/differenceInMonths';
import format from 'date-fns/format';
import isEqual from 'date-fns/isEqual';
import isPast from 'date-fns/isPast';
import isValid from 'date-fns/isValid';
import { es } from 'date-fns/locale';
import millisecondsToMinutes from 'date-fns/millisecondsToMinutes';
import millisecondsToSeconds from 'date-fns/millisecondsToSeconds';

const toTimeZonedDate = (date: string) => {
  const parsedDate = new Date(date);
  var userTimezoneOffset = parsedDate.getTimezoneOffset() * 60000;

  return new Date(parsedDate.getTime() + userTimezoneOffset);
};

const dateToDateString = (date: Date): string =>
  format(date, 'd LLL yyyy', { locale: es });

const dateToString = (
  date: string | Date,
  dateFormat = "iiii',' dd 'de' MMMM 'de' yyyy"
): string =>
  format(typeof date === 'string' ? toTimeZonedDate(date) : date, dateFormat, {
    locale: es
  });

const dateToDateTimeString = (
  date: string | Date,
  dateFormat = 'd iii. HH:mm'
): string =>
  format(typeof date === 'string' ? toTimeZonedDate(date) : date, dateFormat, {
    locale: es
  });

const dateToTimeString = (date: string | Date, dateFormat = 'HH:mm'): string =>
  format(typeof date === 'string' ? toTimeZonedDate(date) : date, dateFormat, {
    locale: es
  });

const getCurrentDateFormatted = (): string =>
  format(new Date(), "iiii',' dd 'de' MMMM 'de' yyyy", {
    locale: es
  });

const isDateEqual = (date: Date, otherDate: Date): boolean =>
  isEqual(
    new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`),
    new Date(
      `${otherDate.getFullYear()}/${
        otherDate.getMonth() + 1
      }/${otherDate.getDate()}`
    )
  );

const getDistanceString = (date: Date): string => {
  const daysDifference = differenceInCalendarDays(new Date(), date);
  if (daysDifference <= 1) return dateToTimeString(date, 'HH:mm');
  if (daysDifference <= 2) return 'Ayer';
  return dateToDateString(date);
};

const getDistanceDaysString = (
  date: Date,
  dateFormat = 'd LLL yyyy'
): string => {
  const daysDifference = differenceInCalendarDays(new Date(), date);
  if (daysDifference === 0) return 'Hoy';
  if (daysDifference === 1) return 'Ayer';
  return format(date, dateFormat, { locale: es });
};

const gapDifferenceInDays = (date: Date, gap = 1): boolean =>
  differenceInDays(date, new Date()) <= gap;

const gapDifferenceInMonths = (date: Date, gap = 1): boolean =>
  differenceInMonths(date, new Date()) <= gap;

const getCurrentDatePlusDays = (daysToAdd: number) =>
  addDays(new Date(), daysToAdd);

const getCurrentDatePlusHours = (hoursToAdd: number) =>
  addHours(new Date(), hoursToAdd);

const getDatePlusMinutes = (date: Date, minutesToAdd: number) =>
  addMinutes(date, minutesToAdd);

const getCurrentDatePlusMonths = (monthsToAdd: number) =>
  addMonths(new Date(), monthsToAdd);

const getExpirationDate = (spanInSeconds: number) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + spanInSeconds);
  return now;
};

const isValidDate = (date: Date) => {
  return isValid(date);
};

const isPastDate = (date: Date) => {
  return isPast(date);
};

const formattedTime = (milliseconds: number) => {
  const helperDate = addMilliseconds(new Date(0), milliseconds);
  return format(helperDate, 'mm:ss');
};

const formmatedTimeA11Y = (milliseconds: number) => {
  const minutes = millisecondsToMinutes(milliseconds);
  const seconds = millisecondsToSeconds(milliseconds) % 60;
  return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}, ${seconds} ${
    seconds === 1 ? 'segundo' : 'segundos'
  }`;
};

const converTimeToDate = (time: string | undefined) => {
  if (!time) return undefined;
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date;
};

export {
  dateToString,
  dateToTimeString,
  getCurrentDateFormatted,
  getDistanceString,
  gapDifferenceInDays,
  gapDifferenceInMonths,
  dateToDateTimeString,
  getCurrentDatePlusDays,
  getCurrentDatePlusHours,
  getDatePlusMinutes,
  getCurrentDatePlusMonths,
  isDateEqual,
  getExpirationDate,
  getDistanceDaysString,
  isValidDate,
  isPastDate,
  formattedTime,
  formmatedTimeA11Y,
  converTimeToDate,
  toTimeZonedDate
};
