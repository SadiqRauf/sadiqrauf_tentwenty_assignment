import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './tmdb';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES &&
        (!(error instanceof ApiError) || error.isRetryable),
    },
  },
});
