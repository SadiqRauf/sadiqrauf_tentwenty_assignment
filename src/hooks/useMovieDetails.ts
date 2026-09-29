import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../services/queryKeys';
import { getMovieDetails } from '../services/tmdb';

export const movieDetailsQuery = (movieId: number) =>
  queryOptions({
    queryKey: queryKeys.movies.detail(movieId),
    queryFn: ({ signal }) => getMovieDetails(movieId, signal),
  });

export function useMovieDetails(movieId: number) {
  return useQuery(movieDetailsQuery(movieId));
}
