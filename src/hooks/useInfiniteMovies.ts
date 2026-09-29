import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import type { MovieSummary, Paginated } from '../services/tmdb';
import { uniqueById } from '../utils/uniqueById';

export type MoviePages = InfiniteData<Paginated<MovieSummary>, number>;

const flattenPages = (data: MoviePages) =>
  uniqueById(data.pages.flatMap(page => page.results));

export const totalResults = (data: MoviePages | undefined) =>
  data?.pages[0]?.total_results;

const selectMovies = (data: MoviePages) => ({
  movies: flattenPages(data),
  total: totalResults(data),
});

interface Options {
  queryKey: QueryKey;
  fetchPage: (
    page: number,
    signal: AbortSignal,
  ) => Promise<Paginated<MovieSummary>>;
  enabled?: boolean;
  keepPrevious?: boolean;
}

export function useInfiniteMovies({
  queryKey,
  fetchPage,
  enabled = true,
  keepPrevious = false,
}: Options) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    select: selectMovies,
    enabled,
    placeholderData: keepPrevious ? previous => previous : undefined,
  });
}
