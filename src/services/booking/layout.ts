import type { Seat, SeatRow } from './types';

export function columnCount(layout: SeatRow[]): number {
  return layout.reduce((max, row) => Math.max(max, row.cells.length), 0);
}

export function seatsById(layout: SeatRow[]): Map<string, Seat> {
  const map = new Map<string, Seat>();
  layout.forEach(row =>
    row.cells.forEach(cell => {
      if (cell) {
        map.set(cell.id, cell);
      }
    }),
  );
  return map;
}
