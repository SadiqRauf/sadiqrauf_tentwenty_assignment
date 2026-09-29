import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchShowtimes, type Showtime } from '../services/booking';

export const showtimesKey = (movieId: number, date: string) =>
  ['showtimes', movieId, date] as const;

export function useShowtimes(movieId: number, date: string) {
  return useQuery({
    queryKey: showtimesKey(movieId, date),
    queryFn: () => fetchShowtimes(movieId, date),
  });
}

export function useShowtime(movieId: number, date: string, showtimeId: string) {
  const select = useCallback(
    (showtimes: Showtime[]) =>
      showtimes.find(showtime => showtime.id === showtimeId),
    [showtimeId],
  );
  return useQuery({
    queryKey: showtimesKey(movieId, date),
    queryFn: () => fetchShowtimes(movieId, date),
    select,
  });
}
