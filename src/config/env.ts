import { TMDB_ACCESS_TOKEN, TMDB_API_KEY, TMDB_BASE_URL } from '@env';

const DEFAULT_TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const env = {
  tmdbAccessToken: TMDB_ACCESS_TOKEN?.trim() ?? '',
  tmdbApiKey: TMDB_API_KEY?.trim() ?? '',
  tmdbBaseUrl: (TMDB_BASE_URL?.trim() || DEFAULT_TMDB_BASE_URL).replace(
    /\/+$/,
    '',
  ),
} as const;

if (__DEV__ && !env.tmdbAccessToken && !env.tmdbApiKey) {
  console.warn(
    'No TMDB credential set. Copy .env.example to .env, add TMDB_ACCESS_TOKEN or TMDB_API_KEY, then run `npm run start:clean`.',
  );
}
