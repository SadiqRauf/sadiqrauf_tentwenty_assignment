import { pickTrailer, rankImages } from '../src/services/tmdb/selectors';
import type { ImageAsset, Video } from '../src/services/tmdb/types';

const video = (overrides: Partial<Video>): Video => ({
  id: overrides.key ?? 'id',
  key: 'key',
  name: 'name',
  site: 'YouTube',
  type: 'Trailer',
  official: true,
  size: 1080,
  published_at: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('pickTrailer', () => {
  it('prefers trailers over teasers and ignores other types and sites', () => {
    const picked = pickTrailer([
      video({ key: 'featurette', type: 'Featurette' }),
      video({ key: 'vimeo', site: 'Vimeo' }),
      video({ key: 'teaser', type: 'Teaser' }),
      video({ key: 'trailer' }),
    ]);
    expect(picked?.key).toBe('trailer');
  });

  it('prefers official, then higher resolution, then newest', () => {
    const picked = pickTrailer([
      video({ key: 'fan', official: false, size: 2160 }),
      video({ key: 'sd', size: 480 }),
      video({ key: 'old', published_at: '2023-01-01T00:00:00.000Z' }),
      video({ key: 'new', published_at: '2024-06-01T00:00:00.000Z' }),
    ]);
    expect(picked?.key).toBe('new');
  });

  it('falls back to a teaser when there is no trailer', () => {
    expect(pickTrailer([video({ key: 't', type: 'Teaser' })])?.key).toBe('t');
  });

  it('returns undefined when nothing is playable', () => {
    expect(pickTrailer([video({ type: 'Clip' })])).toBeUndefined();
  });
});

describe('rankImages', () => {
  const image = (file_path: string, vote_average: number, vote_count: number) =>
    ({
      file_path,
      vote_average,
      vote_count,
      aspect_ratio: 1.78,
      iso_639_1: null,
    } as ImageAsset);

  it('orders by rating then vote count without mutating input', () => {
    const input = [image('a', 5, 1), image('b', 5.5, 2), image('c', 5.5, 10)];
    expect(rankImages(input).map(i => i.file_path)).toEqual(['c', 'b', 'a']);
    expect(input[0].file_path).toBe('a');
  });
});
