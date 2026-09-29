import { formatReleaseLabel } from '../src/utils/format';

describe('formatReleaseLabel', () => {
  const now = new Date(2026, 8, 29, 18, 0); // Sep 29 2026, evening local time

  it('labels future and same-day releases as in theaters', () => {
    expect(formatReleaseLabel('2026-12-22', now)).toBe(
      'In theaters December 22, 2026',
    );
    expect(formatReleaseLabel('2026-09-29', now)).toBe(
      'In theaters September 29, 2026',
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
