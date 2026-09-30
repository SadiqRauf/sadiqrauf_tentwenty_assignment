import { applyReservations, readBookings, saveBooking } from './bookings';
import { buildShowtimes, getShowDates } from './mockShowtimes';
import type { Showtime } from './types';

export { getShowDates, saveBooking };
export type { Booking } from './bookings';
export { columnCount, seatsById } from './layout';
export type { Seat, SeatCell, SeatKind, SeatRow, Showtime } from './types';

export async function fetchShowtimes(
  movieId: number,
  date: string,
): Promise<Showtime[]> {
  return applyReservations(buildShowtimes(movieId, date), readBookings());
}
