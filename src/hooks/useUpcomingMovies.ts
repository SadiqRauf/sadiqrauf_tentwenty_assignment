import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  getUpcomingMovies,
  type MovieSummary,
  type Paginated,
} from '../services/tmdb';
import { uniqueById } from '../utils/uniqueById';

export const upcomingMoviesKey = ['movies', 'upcoming'] as const;

const flattenPages = (data: InfiniteData<Paginated<MovieSummary>, number>) =>
  uniqueById(data.pages.flatMap(page => page.results));

export function useUpcomingMovies() {
  return useInfiniteQuery({
    queryKey: upcomingMoviesKey,
    queryFn: ({ pageParam, signal }) => getUpcomingMovies(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    select: flattenPages,
  });
}

export function useRefreshUpcomingMovies() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    queryClient.setQueryData<InfiniteData<Paginated<MovieSummary>, number>>(
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
