import type { Seat } from '../services/booking';
import { colors } from '../theme';

export function seatColor(seat: Seat, selected: boolean): string {
  if (!seat.available) {
    return colors.seatUnavailable;
  }
  if (selected) {
    return colors.seatSelected;
  }
  return seat.kind === 'vip' ? colors.seatVip : colors.seatRegular;
}
