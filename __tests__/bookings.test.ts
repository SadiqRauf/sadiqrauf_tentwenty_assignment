import {
  applyReservations,
  readBookings,
  saveBooking,
} from '../src/services/booking/bookings';
import { buildShowtimes } from '../src/services/booking/mockShowtimes';
import type { KeyValueStore } from '../src/services/storage';

const memoryStore = (): KeyValueStore => {
  const values = new Map<string, string>();
  return {
    getString: key => values.get(key),
    set: (key, value) => void values.set(key, value),
    remove: key => void values.delete(key),
  };
};

describe('bookings', () => {
  it('saves and reads bookings in order', () => {
    const store = memoryStore();
    const now = new Date('2026-10-01T10:00:00Z');
    saveBooking(
      { movieId: 1, showtimeId: 's1', seatIds: ['1-1'], total: 50 },
      store,
      now,
    );
    saveBooking(
      { movieId: 1, showtimeId: 's2', seatIds: ['2-2'], total: 75 },
      store,
      now,
    );

    const bookings = readBookings(store);
    expect(bookings.map(b => b.showtimeId)).toEqual(['s1', 's2']);
    expect(bookings[0].createdAt).toBe('2026-10-01T10:00:00.000Z');
  });

  it('treats missing or corrupt data as no bookings', () => {
    const store = memoryStore();
    expect(readBookings(store)).toEqual([]);
    store.set('bookings.v1', '{not json');
    expect(readBookings(store)).toEqual([]);
    store.set('bookings.v1', '{"an":"object"}');
    expect(readBookings(store)).toEqual([]);
  });

  it('marks booked seats as sold for that showtime only', () => {
    const [first, second] = buildShowtimes(7, '2026-10-01');
    const seat = first.layout
      .flatMap(row => row.cells)
      .find(cell => cell?.available)!;

    const [bookedShow, otherShow] = applyReservations(
      [first, second],
      [
        {
          id: 'b',
          movieId: 7,
          showtimeId: first.id,
          seatIds: [seat.id],
          total: 50,
          createdAt: '',
        },
      ],
    );

    const find = (id: string, show: typeof first) =>
      show.layout.flatMap(row => row.cells).find(cell => cell?.id === id);
    expect(find(seat.id, bookedShow)?.available).toBe(false);
    expect(otherShow).toBe(second);
  });
});
