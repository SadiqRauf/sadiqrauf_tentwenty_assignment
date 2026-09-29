import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  discoverMoviesByGenre,
  getMovieGenres,
  getPopularMovies,
  type Genre,
  type MovieSummary,
  type Paginated,
} from '../services/tmdb';

const DAY = 24 * 60 * 60 * 1000;
const ARTWORK_PAGES = [1, 2, 3];

export interface GenreTile {
  genre: Genre;
  label: string;
  backdropPath: string | null;
}

const DISPLAY_NAMES: Record<string, string> = {
  Comedy: 'Comedies',
  Drama: 'Dramas',
  Documentary: 'Documentaries',
};

export function useGenres() {
  return useQuery({
    queryKey: ['genres', 'movie'],
    queryFn: ({ signal }) => getMovieGenres(signal),
    // The genre list changes a few times a decade.
    staleTime: DAY,
    gcTime: DAY,
  });
}

export function useGenreNames() {
  const { data } = useGenres();
  return useMemo(
    () => new Map((data ?? []).map(genre => [genre.id, genre.name])),
    [data],
  );
}

const firstBackdrop = (page: Paginated<MovieSummary>) =>
  page.results.find(movie => movie.backdrop_path)?.backdrop_path ?? null;

const collectBackdrops = (results: { data?: string | null }[]) =>
  results.map(result => result.data ?? null);

export function assignGenreArtwork(
  genres: Genre[],
  movies: MovieSummary[],
): GenreTile[] {
  const used = new Set<number>();
  return genres.map(genre => {
    const candidates = movies.filter(
      movie => movie.backdrop_path && movie.genre_ids?.includes(genre.id),
    );
    const pick = candidates.find(movie => !used.has(movie.id)) ?? candidates[0];
    if (pick) {
      used.add(pick.id);
    }
    return {
      genre,
      label: DISPLAY_NAMES[genre.name] ?? genre.name,
      backdropPath: pick?.backdrop_path ?? null,
    };
  });
}

/**
 * Genre tiles for the search landing grid. Artwork comes from a few pages of popular
 * films (3 requests) rather than one discover request per genre (~19). Niche genres that
 * popular films never cover (documentary, history...) then get one request each.
 */
export function useGenreTiles() {
  const genres = useGenres();
  const artwork = useQuery({
    queryKey: ['genres', 'artwork'],
    queryFn: async ({ signal }) => {
      const pages = await Promise.all(
        ARTWORK_PAGES.map(page => getPopularMovies(page, signal)),
      );
      return pages.flatMap(page => page.results);
    },
    staleTime: DAY,
  });

  const baseTiles = useMemo(
    () =>
      genres.data ? assignGenreArtwork(genres.data, artwork.data ?? []) : [],
    [genres.data, artwork.data],
  );

  // Only once the popular pages have landed, or every tile would look "missing".
  const missingIds = useMemo(
    () =>
      artwork.data
        ? baseTiles
            .filter(tile => !tile.backdropPath)
            .map(tile => tile.genre.id)
        : [],
    [artwork.data, baseTiles],
  );
  const fallbackBackdrops = useQueries({
    queries: missingIds.map(genreId => ({
      // Its own key: ['movies', 'genre', id] is the paginated results screen's cache.
      queryKey: ['genres', 'artwork', genreId],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        discoverMoviesByGenre(genreId, 1, signal),
      select: firstBackdrop,
      staleTime: DAY,
    })),
    combine: collectBackdrops,
  });

  const tiles = useMemo(() => {
    const byGenre = new Map(
      missingIds.map((genreId, index) => [genreId, fallbackBackdrops[index]]),
    );
    return baseTiles.map(tile =>
      tile.backdropPath
        ? tile
        : { ...tile, backdropPath: byGenre.get(tile.genre.id) ?? null },
    );
  }, [baseTiles, missingIds, fallbackBackdrops]);

  return {
    tiles,
    // Tiles render as soon as names arrive; artwork fills in when it lands.
    isPending: genres.isPending,
    isError: genres.isError,
    refetch: genres.refetch,
  };
}
