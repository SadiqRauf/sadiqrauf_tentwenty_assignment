import { storage, type KeyValueStore } from '../storage';
import type { Showtime } from './types';

export interface Booking {
  id: string;
  movieId: number;
  showtimeId: string;
  seatIds: string[];
  total: number;
  createdAt: string;
}

const BOOKINGS_KEY = 'bookings.v1';

export function readBookings(store: KeyValueStore = storage): Booking[] {
  const raw = store.getString(BOOKINGS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(
  booking: Omit<Booking, 'id' | 'createdAt'>,
  store: KeyValueStore = storage,
  now: Date = new Date(),
): Booking {
  const saved: Booking = {
    ...booking,
    id: `${booking.showtimeId}-${now.getTime()}`,
    createdAt: now.toISOString(),
  };
  store.set(BOOKINGS_KEY, JSON.stringify([...readBookings(store), saved]));
  return saved;
}

export function applyReservations(
  showtimes: Showtime[],
  bookings: Booking[],
): Showtime[] {
  const reserved = new Map<string, Set<string>>();
  bookings.forEach(booking => {
    const seats = reserved.get(booking.showtimeId) ?? new Set<string>();
    booking.seatIds.forEach(id => seats.add(id));
    reserved.set(booking.showtimeId, seats);
  });

  return showtimes.map(showtime => {
    const taken = reserved.get(showtime.id);
    if (!taken) {
      return showtime;
    }
    return {
      ...showtime,
      layout: showtime.layout.map(row => ({
        ...row,
        cells: row.cells.map(cell =>
          cell && taken.has(cell.id) ? { ...cell, available: false } : cell,
        ),
      })),
    };
  });
}
