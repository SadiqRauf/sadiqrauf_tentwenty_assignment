import { TMDB_ACCESS_TOKEN, TMDB_API_KEY } from '@env';

export const env = {
  tmdbAccessToken: TMDB_ACCESS_TOKEN?.trim() ?? '',
  tmdbApiKey: TMDB_API_KEY?.trim() ?? '',
} as const;

if (__DEV__ && !env.tmdbAccessToken && !env.tmdbApiKey) {
  console.warn(
    'No TMDB credential set. Copy .env.example to .env, add TMDB_ACCESS_TOKEN or TMDB_API_KEY, then run `npm run start:clean`.',
  );
}
