import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Dashboard: undefined;
  Watch: undefined;
  MediaLibrary: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  MovieDetail: {
    movieId: number;
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string;
  };
  Trailer: { videoKey: string; title: string };
  Showtimes: { movieId: number; title: string; releaseDate: string };
  SeatSelection: {
    movieId: number;
    title: string;
    date: string;
    showtimeId: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
