import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import type { MovieSummary } from '../services/tmdb';

export function useOpenMovie() {
  const navigation = useNavigation();
  return useCallback(
    (movie: MovieSummary) =>
      navigation.navigate('MovieDetail', {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: movie.release_date,
      }),
    [navigation],
  );
}

export function useMovieActions() {
  const navigation = useNavigation();
  const openMovie = useOpenMovie();

  return useCallback(
    (movie: MovieSummary) => {
      const getTickets = () =>
        navigation.navigate('Showtimes', {
          movieId: movie.id,
          title: movie.title,
          releaseDate: movie.release_date,
        });

      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: movie.title,
            options: ['View Details', 'Get Tickets', 'Cancel'],
            cancelButtonIndex: 2,
          },
          index => {
            if (index === 0) {
              openMovie(movie);
            } else if (index === 1) {
              getTickets();
            }
          },
        );
        return;
      }

      Alert.alert(movie.title, undefined, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get Tickets', onPress: getTickets },
        { text: 'View Details', onPress: () => openMovie(movie) },
      ]);
    },
    [navigation, openMovie],
  );
}
