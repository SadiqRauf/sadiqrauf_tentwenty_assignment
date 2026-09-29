import { assignGenreArtwork } from '../src/hooks/useGenres';
import { normaliseQuery } from '../src/hooks/useMovieSearch';
import type { MovieSummary } from '../src/services/tmdb/types';
import { formatResultCount } from '../src/utils/format';

const movie = (
  id: number,
  genre_ids: number[],
  backdrop_path: string | null = `/${id}.jpg`,
): MovieSummary => ({
  id,
  title: `Movie ${id}`,
  overview: '',
  release_date: '',
  poster_path: null,
  backdrop_path,
  genre_ids,
});

describe('normaliseQuery', () => {
  it('trims, collapses whitespace and lowercases', () => {
    expect(normaliseQuery('  In   Time ')).toBe('in time');
    expect(normaliseQuery('TIM')).toBe(normaliseQuery('tim '));
  });
});

describe('assignGenreArtwork', () => {
  const genres = [
    { id: 1, name: 'Comedy' },
    { id: 2, name: 'Crime' },
    { id: 3, name: 'Western' },
  ];

  it('gives each genre a distinct film when one is available', () => {
    const tiles = assignGenreArtwork(genres, [
      movie(10, [1, 2]),
      movie(11, [2]),
    ]);
    expect(tiles.map(tile => tile.backdropPath)).toEqual([
      '/10.jpg',
      '/11.jpg',
      null,
    ]);
  });

  it('reuses a film rather than leaving a tile blank', () => {
    const tiles = assignGenreArtwork(genres.slice(0, 2), [movie(10, [1, 2])]);
    expect(tiles.map(tile => tile.backdropPath)).toEqual([
      '/10.jpg',
      '/10.jpg',
    ]);
  });

  it('skips films without a backdrop', () => {
    const [tile] = assignGenreArtwork(genres.slice(0, 1), [
      movie(10, [1], null),
      movie(11, [1]),
    ]);
    expect(tile.backdropPath).toBe('/11.jpg');
  });

  it("uses the design's plural labels", () => {
    expect(assignGenreArtwork(genres, []).map(tile => tile.label)).toEqual([
      'Comedies',
      'Crime',
      'Western',
    ]);
  });
});

describe('formatResultCount', () => {
  it('pluralises and groups thousands', () => {
    expect(formatResultCount(1)).toBe('1 Result Found');
    expect(formatResultCount(3)).toBe('3 Results Found');
    expect(formatResultCount(12345)).toBe('12,345 Results Found');
    expect(formatResultCount(0)).toBe('0 Results Found');
  });

  it('shows a placeholder until the total is known', () => {
    expect(formatResultCount(undefined)).toBe('Searching…');
  });
});
