import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getUpcomingMovies } from '../services/tmdb';
import { useInfiniteMovies, type MoviePages } from './useInfiniteMovies';

export const upcomingMoviesKey = ['movies', 'upcoming'] as const;

export function useUpcomingMovies() {
  return useInfiniteMovies({
    queryKey: upcomingMoviesKey,
    fetchPage: getUpcomingMovies,
  });
}

export function useRefreshUpcomingMovies() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    queryClient.setQueryData<MoviePages>(
      upcomingMoviesKey,
      data =>
        data && {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        },
    );
    await queryClient.refetchQueries({ queryKey: upcomingMoviesKey });
  }, [queryClient]);
}
