const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "long" });

/**
 * Returns a relative time unit and value for a given time in milliseconds
 *
 * @param milliseconds - Relative time in milliseconds
 * @returns - [value, unit]
 */
export function getTimeUnit(milliseconds: number): [number, Intl.RelativeTimeFormatUnit] {
  const seconds = milliseconds / 1000;
  if (Math.abs(seconds) < 60) return [Math.round(seconds), "second"];
  const minutes = seconds / 60;
  if (Math.abs(minutes) < 60) return [Math.round(minutes), "minute"];
  const hours = minutes / 60;
  if (Math.abs(hours) < 24) return [Math.round(hours), "hour"];
  const days = hours / 24;
  if (Math.abs(days) < 30) return [Math.round(days), "day"];
  const months = days / 30;
  if (Math.abs(months) < 12) return [Math.round(months), "month"];
  const years = months / 12;
  return [Math.round(years), "year"];
}

/**
 * Returns date difference `from - to` in milliseconds.
 *
 * @param from - From date
 * @param to - To date, defaults to now
 * @returns - Date difference in milliseconds
 */
export function getDateDiff(from: Date | number | string, to?: Date | number | string) {
  from = new Date(from);
  to = to == null ? new Date() : new Date(to);
  return Math.round(from.getTime() - to.getTime());
}

/**
 * Returns date difference `from - to` in milliseconds, ignoring time.
 *
 * @param from - From date
 * @param to - To date, defaults to now
 * @returns - Date difference in milliseconds
 */
export function getDateOnlyDiff(from: Date | number | string, to?: Date | number | string) {
  from = new Date(from);
  to = to == null ? new Date() : new Date(to);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  return Math.round(from.getTime() - to.getTime());
}

/**
 * Pretty format a date relative to now.
 *
 * @param date - Date to format
 * @param to - Date to compare to, defaults to now
 * @returns - Pretty relative date
 */
export function prettyRelativeDate(
  date: Date | string | number,
  to?: Date | number | string,
): string {
  date = new Date(date);
  const dateDiffMs = getDateDiff(date, to);
  const [diff, unit] = getTimeUnit(dateDiffMs);
  return RTF.format(diff, unit);
}
