const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function parseLocalDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }
  const [, year, month, day] = match.map(Number);
  return new Date(year, month - 1, day);
}

export function formatReleaseLabel(
  releaseDate: string,
  now: Date = new Date(),
): string | undefined {
  const date = parseLocalDate(releaseDate);
  if (!date) {
    return undefined;
  }
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const prefix = date >= today ? 'In theaters' : 'Released';
  return `${prefix} ${dateFormatter.format(date)}`;
}
