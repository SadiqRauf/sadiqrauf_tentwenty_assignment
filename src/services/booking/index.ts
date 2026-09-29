import { buildShowtimes, getShowDates } from './mockShowtimes';
import type { Showtime } from './types';

export { getShowDates };
export { columnCount, seatsById } from './layout';
export type { Seat, SeatCell, SeatKind, SeatRow, Showtime } from './types';

export async function fetchShowtimes(
  movieId: number,
  date: string,
): Promise<Showtime[]> {
  return buildShowtimes(movieId, date);
}
