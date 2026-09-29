import { useCallback, useMemo, useReducer } from 'react';
import { seatsById, type Seat, type Showtime } from '../services/booking';

export const MAX_SEATS = 8;

export interface SeatSelectionState {
  ids: string[];
  rejections: number;
}

export type SeatSelectionAction =
  | { type: 'toggle'; seatId: string; maxSeats: number }
  | { type: 'clear' };

export const initialSeatSelection: SeatSelectionState = {
  ids: [],
  rejections: 0,
};

export function seatSelectionReducer(
  state: SeatSelectionState,
  action: SeatSelectionAction,
): SeatSelectionState {
  switch (action.type) {
    case 'toggle': {
      if (state.ids.includes(action.seatId)) {
        return { ...state, ids: state.ids.filter(id => id !== action.seatId) };
      }
      if (state.ids.length >= action.maxSeats) {
        return { ...state, rejections: state.rejections + 1 };
      }
      return { ...state, ids: [...state.ids, action.seatId] };
    }
    case 'clear':
      return initialSeatSelection;
  }
}

export function useSeatSelection(
  showtime: Showtime | undefined,
  maxSeats = MAX_SEATS,
) {
  const [state, dispatch] = useReducer(
    seatSelectionReducer,
    initialSeatSelection,
  );

  const seatMap = useMemo(
    () => (showtime ? seatsById(showtime.layout) : new Map<string, Seat>()),
    [showtime],
  );
  const selectedIds = useMemo(() => new Set(state.ids), [state.ids]);
  const selectedSeats = useMemo(
    () =>
      state.ids
        .map(id => seatMap.get(id))
        .filter((seat): seat is Seat => seat !== undefined),
    [state.ids, seatMap],
  );
  const total = useMemo(
    () =>
      showtime
        ? selectedSeats.reduce(
            (sum, seat) => sum + showtime.prices[seat.kind],
            0,
          )
        : 0,
    [selectedSeats, showtime],
  );

  const toggle = useCallback(
    (seat: Seat) => dispatch({ type: 'toggle', seatId: seat.id, maxSeats }),
    [maxSeats],
  );

  return {
    selectedIds,
    selectedSeats,
    total,
    toggle,
    rejections: state.rejections,
  };
}
