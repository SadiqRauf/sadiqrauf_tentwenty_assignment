import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { Query } from '@tanstack/react-query';
import type { PersistedClient } from '@tanstack/react-query-persist-client';
import { webStorage } from './storage';

export const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const CACHE_BUSTER = 'v1';
const PERSISTED_PAGES = 2;

const NOT_PERSISTED = new Set(['search', 'showtimes']);

export function shouldPersistQuery(query: Query): boolean {
  return (
    query.state.status === 'success' &&
    !query.queryKey.some(part => NOT_PERSISTED.has(String(part)))
  );
}

interface InfiniteLike {
  pages: unknown[];
  pageParams: unknown[];
}

const isInfinite = (data: unknown): data is InfiniteLike =>
  typeof data === 'object' &&
  data !== null &&
  Array.isArray((data as InfiniteLike).pages) &&
  Array.isArray((data as InfiniteLike).pageParams);

export function trimForStorage(client: PersistedClient): PersistedClient {
  return {
    ...client,
    clientState: {
      ...client.clientState,
      queries: client.clientState.queries.map(query => {
        const { data } = query.state;
        if (!isInfinite(data) || data.pages.length <= PERSISTED_PAGES) {
          return query;
        }
        return {
          ...query,
          state: {
            ...query.state,
            data: {
              pages: data.pages.slice(0, PERSISTED_PAGES),
              pageParams: data.pageParams.slice(0, PERSISTED_PAGES),
            },
          },
        };
      }),
    },
  };
}

export const persister = createSyncStoragePersister({
  storage: webStorage,
  key: 'query-cache',
  throttleTime: 1000,
  serialize: client => JSON.stringify(trimForStorage(client)),
});

export const persistOptions = {
  persister,
  maxAge: CACHE_MAX_AGE,
  buster: CACHE_BUSTER,
  dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
};
