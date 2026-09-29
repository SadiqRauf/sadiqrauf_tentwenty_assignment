import { tmdbGet } from './client';
import type { MovieDetails, MovieSummary, Paginated } from './types';

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
