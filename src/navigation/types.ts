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
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
