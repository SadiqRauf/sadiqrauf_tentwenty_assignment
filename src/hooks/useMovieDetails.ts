import { useQuery } from '@tanstack/react-query';
import { getMovieDetails } from '../services/tmdb';

export const movieDetailsKey = (movieId: number) =>
  ['movies', 'detail', movieId] as const;

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: movieDetailsKey(movieId),
    queryFn: ({ signal }) => getMovieDetails(movieId, signal),
  });
}
