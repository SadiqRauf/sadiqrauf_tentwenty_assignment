import { tmdbGet } from './client';
import type { Genre, MovieDetails, MovieSummary, Paginated } from './types';

export function getUpcomingMovies(page: number, signal?: AbortSignal) {
  return tmdbGet<Paginated<MovieSummary>>(
    '/movie/upcoming',
    { page, language: 'en-US' },
    signal,
  );
}

export function getMovieDetails(movieId: number, signal?: AbortSignal) {
  return tmdbGet<MovieDetails>(
    `/movie/${movieId}`,
    {
      language: 'en-US',
      append_to_response: 'videos,images',
      include_image_language: 'en,null',
    },
    signal,
  );
}

export function getPopularMovies(page: number, signal?: AbortSignal) {
  return tmdbGet<Paginated<MovieSummary>>(
    '/movie/popular',
    { page, language: 'en-US' },
    signal,
  );
}

export function searchMovies(
  query: string,
  page: number,
  signal?: AbortSignal,
) {
  return tmdbGet<Paginated<MovieSummary>>(
    '/search/movie',
    { query, page, language: 'en-US', include_adult: 'false' },
    signal,
  );
}

export function discoverMoviesByGenre(
  genreId: number,
  page: number,
  signal?: AbortSignal,
) {
  return tmdbGet<Paginated<MovieSummary>>(
    '/discover/movie',
    {
      with_genres: genreId,
      page,
      language: 'en-US',
      sort_by: 'popularity.desc',
      include_adult: 'false',
    },
    signal,
  );
}

export async function getMovieGenres(signal?: AbortSignal) {
  const { genres } = await tmdbGet<{ genres: Genre[] }>(
    '/genre/movie/list',
    { language: 'en-US' },
    signal,
  );
  return genres;
}
