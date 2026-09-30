import type { Query } from '@tanstack/react-query';
import type { PersistedClient } from '@tanstack/react-query-persist-client';
import {
  shouldPersistQuery,
  trimForStorage,
} from '../src/services/persistence';
import { queryKeys } from '../src/services/queryKeys';

const query = (queryKey: readonly unknown[], status = 'success') =>
  ({ queryKey, state: { status } } as unknown as Query);

describe('shouldPersistQuery', () => {
  it('saves successful movie and genre queries', () => {
    expect(shouldPersistQuery(query(queryKeys.movies.upcoming()))).toBe(true);
    expect(shouldPersistQuery(query(queryKeys.movies.detail(1)))).toBe(true);
    expect(shouldPersistQuery(query(queryKeys.genres.list()))).toBe(true);
  });

  it('skips failed or loading queries', () => {
    expect(shouldPersistQuery(query(queryKeys.movies.detail(1), 'error'))).toBe(
      false,
    );
    expect(
      shouldPersistQuery(query(queryKeys.movies.detail(1), 'pending')),
    ).toBe(false);
  });

  it('skips per-keystroke searches and locally generated showtimes', () => {
    expect(shouldPersistQuery(query(queryKeys.movies.search('tim')))).toBe(
      false,
    );
    expect(
      shouldPersistQuery(query(queryKeys.showtimes(1, '2026-10-01'))),
    ).toBe(false);
  });
});

describe('trimForStorage', () => {
  const persisted = (data: unknown): PersistedClient =>
    ({
      timestamp: 0,
      buster: 'v1',
      clientState: {
        mutations: [],
        queries: [{ queryKey: ['x'], queryHash: 'x', state: { data } }],
      },
    } as unknown as PersistedClient);

  const dataOf = (client: PersistedClient) =>
    client.clientState.queries[0].state.data;

  it('keeps only the first pages of infinite queries', () => {
    const trimmed = trimForStorage(
      persisted({ pages: [1, 2, 3, 4, 5], pageParams: [1, 2, 3, 4, 5] }),
    );
    expect(dataOf(trimmed)).toEqual({ pages: [1, 2], pageParams: [1, 2] });
  });

  it('leaves short infinite queries and plain data untouched', () => {
    const short = { pages: [1], pageParams: [1] };
    expect(dataOf(trimForStorage(persisted(short)))).toBe(short);
    const plain = { id: 1, title: 'Movie' };
    expect(dataOf(trimForStorage(persisted(plain)))).toBe(plain);
  });
});
