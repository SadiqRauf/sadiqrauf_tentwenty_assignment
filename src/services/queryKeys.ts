
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    upcoming: () => [...queryKeys.movies.all, 'upcoming'] as const,
    search: (query: string) =>
      [...queryKeys.movies.all, 'search', query] as const,
    genre: (genreId: number) =>
      [...queryKeys.movies.all, 'genre', genreId] as const,
    detail: (movieId: number) =>
      [...queryKeys.movies.all, 'detail', movieId] as const,
  },
  genres: {
    all: ['genres'] as const,
    list: () => [...queryKeys.genres.all, 'list'] as const,
    popularArtwork: () =>
      [...queryKeys.genres.all, 'artwork', 'popular'] as const,
    genreArtwork: (genreId: number) =>
      [...queryKeys.genres.all, 'artwork', 'genre', genreId] as const,
  },
  showtimes: (movieId: number, date: string) =>
    ['showtimes', movieId, date] as const,
};
