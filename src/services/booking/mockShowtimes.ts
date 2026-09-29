import { hashString, seededRandom } from '../../utils/random';
import { startOfDay, parseLocalDate, toIsoDate } from '../../utils/format';
import type { SeatCell, SeatRow, Showtime } from './types';

const BOOKABLE_DAYS = 10;
const ROW_COUNT = 10;
const BLOCKS = [4, 14, 4];
const SOLD_RATIO = 0.3;
const BONUS_PER_DOLLAR = 50;

const SHOWS = [
  { time: '12:30', hall: 'Hall 1', regular: 50, vip: 150 },
  { time: '13:30', hall: 'Hall 2', regular: 75, vip: 200 },
  { time: '16:00', hall: 'Hall 3', regular: 50, vip: 150 },
  { time: '19:15', hall: 'Hall 1', regular: 75, vip: 200 },
];

export function getShowDates(
  releaseDate: string,
  now: Date = new Date(),
): string[] {
  const today = startOfDay(now);
  const release = parseLocalDate(releaseDate);
  const first = release && release > today ? release : today;
  return Array.from({ length: BOOKABLE_DAYS }, (_, offset) =>
    toIsoDate(
      new Date(first.getFullYear(), first.getMonth(), first.getDate() + offset),
    ),
  );
}

function buildLayout(random: () => number): SeatRow[] {
  return Array.from({ length: ROW_COUNT }, (_, index) => {
    const row = index + 1;
    const isFrontRow = row === 1;
    const kind = row === ROW_COUNT ? 'vip' : 'regular';
    const cells: SeatCell[] = [];
    let number = 0;

    BLOCKS.forEach((size, blockIndex) => {
      if (blockIndex > 0) {
        cells.push(null);
      }
      const isSideBlock = blockIndex !== 1;
      for (let i = 0; i < size; i++) {
        if (isFrontRow && isSideBlock) {
          cells.push(null);
          continue;
        }
        number += 1;
        cells.push({
          id: `${row}-${number}`,
          row,
          number,
          kind,
          available: random() >= SOLD_RATIO,
        });
      }
    });

    return { row, cells };
  });
}

export function buildShowtimes(movieId: number, date: string): Showtime[] {
  return SHOWS.map((show, index) => {
    const random = seededRandom(hashString(`${movieId}|${date}|${index}`));
    return {
      id: `${movieId}-${date}-${index}`,
      date,
      time: show.time,
      cinema: 'Cinetech',
      hall: show.hall,
      prices: { regular: show.regular, vip: show.vip },
      bonusFrom: show.regular * BONUS_PER_DOLLAR,
      layout: buildLayout(random),
    };
  });
}
