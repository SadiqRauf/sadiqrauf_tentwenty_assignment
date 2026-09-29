const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const shortMonthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
});

export function parseLocalDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }
  const [, year, month, day] = match.map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatLongDate(isoDate: string): string | undefined {
  const date = parseLocalDate(isoDate);
  return date && longDateFormatter.format(date);
}

export function formatShortDate(isoDate: string): string | undefined {
  const date = parseLocalDate(isoDate);
  return date && `${date.getDate()} ${shortMonthFormatter.format(date)}`;
}

export function formatReleaseLabel(
  releaseDate: string,
  now: Date = new Date(),
): string | undefined {
  const date = parseLocalDate(releaseDate);
  if (!date) {
    return undefined;
  }
  const prefix = date >= startOfDay(now) ? 'In Theaters' : 'Released';
  return `${prefix} ${longDateFormatter.format(date)}`;
}

const countFormatter = new Intl.NumberFormat('en-US');

export function formatResultCount(total: number | undefined): string {
  if (total === undefined) {
    return 'Searching…';
  }
  return `${countFormatter.format(total)} ${
    total === 1 ? 'Result' : 'Results'
  } Found`;
}
