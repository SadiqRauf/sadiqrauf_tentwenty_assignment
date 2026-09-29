import { queryOptions, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchShowtimes, type Showtime } from '../services/booking';
import { queryKeys } from '../services/queryKeys';

/** One definition, so the date screen and seat screen always read the same cache entry. */
export const showtimesQuery = (movieId: number, date: string) =>
  queryOptions({
    queryKey: queryKeys.showtimes(movieId, date),
    queryFn: () => fetchShowtimes(movieId, date),
  });

export function useShowtimes(movieId: number, date: string) {
  return useQuery(showtimesQuery(movieId, date));
}

export function useShowtime(movieId: number, date: string, showtimeId: string) {
  const select = useCallback(
    (showtimes: Showtime[]) =>
      showtimes.find(showtime => showtime.id === showtimeId),
    [showtimeId],
  );
  return useQuery({ ...showtimesQuery(movieId, date), select });
}
