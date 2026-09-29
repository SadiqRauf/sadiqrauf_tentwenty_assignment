import { queryKeys } from '../src/services/queryKeys';

describe('queryKeys', () => {
  it('gives every query its own key', () => {
    const keys = [
      queryKeys.movies.upcoming(),
      queryKeys.movies.search('tim'),
      queryKeys.movies.genre(18),
      queryKeys.movies.detail(18),
      queryKeys.genres.list(),
      queryKeys.genres.popularArtwork(),
      queryKeys.genres.genreArtwork(18),
      queryKeys.showtimes(18, '2026-10-01'),
    ].map(key => JSON.stringify(key));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('nests movie keys under one prefix for bulk invalidation', () => {
    const prefix = queryKeys.movies.all;
    [
      queryKeys.movies.upcoming(),
      queryKeys.movies.search('x'),
      queryKeys.movies.detail(1),
    ].forEach(key => expect(key.slice(0, prefix.length)).toEqual(prefix));
  });

  it('keeps genre artwork apart from the paginated genre results', () => {
    expect(queryKeys.genres.genreArtwork(18)).not.toEqual(
      queryKeys.movies.genre(18),
    );
  });
});
