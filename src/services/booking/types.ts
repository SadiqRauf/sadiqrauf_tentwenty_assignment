export type SeatKind = 'regular' | 'vip';

export interface Seat {
  id: string;
  row: number;
  number: number;
  kind: SeatKind;
  available: boolean;
}

export type SeatCell = Seat | null;

export interface SeatRow {
  row: number;
  cells: SeatCell[];
}

export interface Showtime {
  id: string;
  date: string;
  time: string;
  cinema: string;
  hall: string;
  prices: Record<SeatKind, number>;
  bonusFrom: number;
  layout: SeatRow[];
}
