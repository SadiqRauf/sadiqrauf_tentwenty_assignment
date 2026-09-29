import { useCallback } from 'react';
import { queryKeys } from '../services/queryKeys';
import { discoverMoviesByGenre, searchMovies } from '../services/tmdb';
import { useInfiniteMovies } from './useInfiniteMovies';

export const normaliseQuery = (query: string) =>
  query.trim().replace(/\s+/g, ' ').toLowerCase();

export function useMovieSearch(query: string) {
  const normalised = normaliseQuery(query);
  const fetchPage = useCallback(
    (page: number, signal: AbortSignal) =>
      searchMovies(normalised, page, signal),
    [normalised],
  );
  return useInfiniteMovies({
    queryKey: queryKeys.movies.search(normalised),
    fetchPage,
    enabled: normalised.length > 0,
    keepPrevious: true,
  });
}

export function useMoviesByGenre(genreId: number) {
  const fetchPage = useCallback(
    (page: number, signal: AbortSignal) =>
      discoverMoviesByGenre(genreId, page, signal),
    [genreId],
  );
  return useInfiniteMovies({
    queryKey: queryKeys.movies.genre(genreId),
    fetchPage,
  });
}
