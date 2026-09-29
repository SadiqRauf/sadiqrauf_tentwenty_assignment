import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { queryKeys } from '../services/queryKeys';
import { getUpcomingMovies } from '../services/tmdb';
import { useInfiniteMovies, type MoviePages } from './useInfiniteMovies';

export function useUpcomingMovies() {
  return useInfiniteMovies({
    queryKey: queryKeys.movies.upcoming(),
    fetchPage: getUpcomingMovies,
  });
}

export function useRefreshUpcomingMovies() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    queryClient.setQueryData<MoviePages>(
      queryKeys.movies.upcoming(),
      data =>
        data && {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        },
    );
    await queryClient.refetchQueries({ queryKey: queryKeys.movies.upcoming() });
  }, [queryClient]);
}
