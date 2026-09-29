import type { ImageAsset, Video } from './types';

const VIDEO_TYPE_RANK: Record<string, number> = { Trailer: 0, Teaser: 1 };

export function pickTrailer(videos: Video[]): Video | undefined {
  return videos
    .filter(v => v.site === 'YouTube' && v.type in VIDEO_TYPE_RANK)
    .sort(
      (a, b) =>
        VIDEO_TYPE_RANK[a.type] - VIDEO_TYPE_RANK[b.type] ||
        Number(b.official) - Number(a.official) ||
        b.size - a.size ||
        b.published_at.localeCompare(a.published_at),
    )[0];
}

export function rankImages(images: ImageAsset[]): ImageAsset[] {
  return [...images].sort(
    (a, b) => b.vote_average - a.vote_average || b.vote_count - a.vote_count,
  );
}
