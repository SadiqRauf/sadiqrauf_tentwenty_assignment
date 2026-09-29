const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type PosterSize = 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export function tmdbImageUrl(
  path: string | null | undefined,
  size: BackdropSize | PosterSize,
): string | undefined {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : undefined;
}
