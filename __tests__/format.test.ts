import {
  formatLongDate,
  formatReleaseLabel,
  formatShortDate,
  parseLocalDate,
  toIsoDate,
} from '../src/utils/format';

describe('formatReleaseLabel', () => {
  const now = new Date(2026, 8, 29, 18, 0); // Sep 29 2026, evening local time

  it('labels future and same-day releases as in theaters', () => {
    expect(formatReleaseLabel('2026-12-22', now)).toBe(
      'In Theaters December 22, 2026',
    );
    expect(formatReleaseLabel('2026-09-29', now)).toBe(
      'In Theaters September 29, 2026',
    );
  });

  it('labels past releases as released', () => {
    expect(formatReleaseLabel('2021-12-22', now)).toBe(
      'Released December 22, 2021',
    );
  });

  it('returns undefined for missing or malformed dates', () => {
    expect(formatReleaseLabel('', now)).toBeUndefined();
    expect(formatReleaseLabel('2026-9-1', now)).toBeUndefined();
  });
});

describe('date helpers', () => {
  it('formats chip and long dates without a timezone shift', () => {
    expect(formatShortDate('2021-03-05')).toBe('5 Mar');
    expect(formatLongDate('2021-03-05')).toBe('March 5, 2021');
  });

  it('round-trips ISO dates in local time', () => {
    expect(toIsoDate(parseLocalDate('2026-01-09')!)).toBe('2026-01-09');
  });
});
