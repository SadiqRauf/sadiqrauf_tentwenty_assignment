import { QueryClient } from '@tanstack/react-query';
import { setupOnlineManager } from './network';
import { CACHE_MAX_AGE } from './persistence';
import { ApiError } from './tmdb';

const MAX_RETRIES = 2;

setupOnlineManager();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: CACHE_MAX_AGE,
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES &&
        (!(error instanceof ApiError) || error.isRetryable),
    },
  },
});
