import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  fetchShowtimes,
  saveBooking,
  type Booking,
  type Showtime,
} from '../services/booking';
import { queryKeys } from '../services/queryKeys';

export const showtimesQuery = (movieId: number, date: string) =>
  queryOptions({
    queryKey: queryKeys.showtimes(movieId, date),
    queryFn: () => fetchShowtimes(movieId, date),
    networkMode: 'always',
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

export function useBookSeats(movieId: number, date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'createdAt'>) =>
      saveBooking(booking),
    networkMode: 'always',
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: showtimesQuery(movieId, date).queryKey,
      }),
  });
}
