import {
  initialSeatSelection,
  seatSelectionReducer,
  type SeatSelectionState,
} from '../src/hooks/useSeatSelection';
import { columnCount, seatsById } from '../src/services/booking/layout';
import { buildShowtimes } from '../src/services/booking/mockShowtimes';

const toggle = (state: SeatSelectionState, seatId: string, maxSeats = 2) =>
  seatSelectionReducer(state, { type: 'toggle', seatId, maxSeats });

describe('seatSelectionReducer', () => {
  it('adds seats in pick order and removes them on a second tap', () => {
    let state = toggle(initialSeatSelection, '3-4');
    state = toggle(state, '1-2');
    expect(state.ids).toEqual(['3-4', '1-2']);

    state = toggle(state, '3-4');
    expect(state.ids).toEqual(['1-2']);
  });

  it('refuses picks past the limit and counts the refusal', () => {
    let state = toggle(toggle(initialSeatSelection, 'a'), 'b');
    const full = toggle(state, 'c');
    expect(full.ids).toEqual(['a', 'b']);
    expect(full.rejections).toBe(1);

    // Deselecting still works when full, and frees a slot.
    state = toggle(full, 'a');
    expect(toggle(state, 'c').ids).toEqual(['b', 'c']);
  });

  it('is pure: the same input gives the same output without mutation', () => {
    const before = toggle(initialSeatSelection, 'a');
    const snapshot = JSON.stringify(before);
    expect(toggle(before, 'b')).toEqual(toggle(before, 'b'));
    expect(JSON.stringify(before)).toBe(snapshot);
  });

  it('clears back to the initial state', () => {
    const state = toggle(initialSeatSelection, 'a');
    expect(seatSelectionReducer(state, { type: 'clear' })).toBe(
      initialSeatSelection,
    );
  });
});

describe('layout helpers', () => {
  const [show] = buildShowtimes(1, '2026-10-01');

  it('reports the shared grid width', () => {
    // 4 + aisle + 14 + aisle + 4
    expect(columnCount(show.layout)).toBe(24);
    expect(columnCount([])).toBe(0);
  });

  it('indexes every seat by id and skips aisles', () => {
    const seats = seatsById(show.layout);
    const cellCount = show.layout.flatMap(row =>
      row.cells.filter(Boolean),
    ).length;
    expect(seats.size).toBe(cellCount);
    expect(seats.get('10-1')?.kind).toBe('vip');
  });
});
