import {
  buildShowtimes,
  getShowDates,
} from '../src/services/booking/mockShowtimes';
import { hashString, seededRandom } from '../src/utils/random';

describe('seededRandom', () => {
  it('is deterministic per seed and stays in [0, 1)', () => {
    const a = seededRandom(hashString('seed'));
    const b = seededRandom(hashString('seed'));
    const values = Array.from({ length: 50 }, () => a());
    expect(values).toEqual(Array.from({ length: 50 }, () => b()));
    expect(values.every(v => v >= 0 && v < 1)).toBe(true);
  });
});

describe('getShowDates', () => {
  const now = new Date(2026, 8, 29, 18, 0);

  it('starts on release day for films not yet out', () => {
    const dates = getShowDates('2026-12-22', now);
    expect(dates[0]).toBe('2026-12-22');
    expect(dates[1]).toBe('2026-12-23');
    expect(dates).toHaveLength(10);
  });

  it('starts today for films already released or with no date', () => {
    expect(getShowDates('2020-01-01', now)[0]).toBe('2026-09-29');
    expect(getShowDates('', now)[0]).toBe('2026-09-29');
  });

  it('rolls over month ends', () => {
    expect(getShowDates('2026-10-30', now).slice(0, 3)).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });
});

describe('buildShowtimes', () => {
  it('returns the same halls for the same movie and date', () => {
    expect(buildShowtimes(42, '2026-10-01')).toEqual(
      buildShowtimes(42, '2026-10-01'),
    );
  });

  it('varies availability between dates', () => {
    const availability = (date: string) =>
      buildShowtimes(42, date)[0].layout.flatMap(row =>
        row.cells.map(cell => cell?.available),
      );
    expect(availability('2026-10-01')).not.toEqual(availability('2026-10-02'));
  });

  it('gives every row the same column grid and unique seat ids', () => {
    const [show] = buildShowtimes(7, '2026-10-01');
    const widths = new Set(show.layout.map(row => row.cells.length));
    expect(widths.size).toBe(1);

    const ids = show.layout.flatMap(row =>
      row.cells.flatMap(cell => (cell ? [cell.id] : [])),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('numbers seats within a row and marks the back row as VIP', () => {
    const [show] = buildShowtimes(7, '2026-10-01');
    const back = show.layout[show.layout.length - 1];
    const seats = back.cells.filter(cell => cell !== null);
    expect(seats.map(seat => seat!.number)).toEqual(seats.map((_, i) => i + 1));
    expect(seats.every(seat => seat!.kind === 'vip')).toBe(true);
  });
});
