import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CloudOff } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OfflineMessage } from '../../components/OfflineMessage';
import { StateMessage } from '../../components/StateMessage';
import { isOfflineWithoutData } from '../../hooks/useIsOnline';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import { useStatusBarStyle } from '../../hooks/useStatusBar';
import type { RootStackParamList } from '../../navigation/types';
import { pickTrailer, tmdbImageUrl } from '../../services/tmdb';
import { colors, spacing, typography } from '../../theme';
import { formatReleaseLabel } from '../../utils/format';
import { DetailBodySkeleton } from './DetailBodySkeleton';
import { DetailHeader } from './DetailHeader';
import { GenreChips } from './GenreChips';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

export function MovieDetailScreen({ route, navigation }: Props) {
  const { movieId, title, posterPath, backdropPath, releaseDate } =
    route.params;
  const { bottom } = useSafeAreaInsets();
  useStatusBarStyle('light-content');
  const layout = useResponsiveLayout();
  const details = useMovieDetails(movieId);
  const { data: movie, error, isPending, refetch } = details;
  const offline = isOfflineWithoutData(details);

  const trailer = useMemo(
    () => movie && pickTrailer(movie.videos.results),
    [movie],
  );

  const imageUri = layout.isLandscape
    ? tmdbImageUrl(backdropPath, 'w1280') ?? tmdbImageUrl(posterPath, 'w780')
    : tmdbImageUrl(posterPath, 'w780') ?? tmdbImageUrl(backdropPath, 'w780');
  const trailerAction = offline
    ? undefined
    : isPending
    ? { loading: true }
    : trailer
    ? {
        loading: false,
        onPress: () =>
          navigation.navigate('Trailer', { videoKey: trailer.key, title }),
      }
    : undefined;

  const renderBody = () => {
    if (offline) {
      return (
        <View style={styles.error}>
          <OfflineMessage subject="This movie's details" />
        </View>
      );
    }
    if (isPending) {
      return <DetailBodySkeleton />;
    }
    if (!movie) {
      return (
        <View style={styles.error}>
          <StateMessage
            icon={CloudOff}
            title="Couldn't load this movie"
            message={error?.message}
            action={{ label: 'Try again', onPress: () => refetch() }}
          />
        </View>
      );
    }
    return (
      <>
        <View style={[styles.section, layout.gutter(spacing.xxl)]}>
          {movie.genres.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Genres</Text>
              <GenreChips genres={movie.genres} />
              <View style={styles.divider} />
            </>
          ) : null}
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>
            {movie.overview || 'No overview is available for this movie yet.'}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <DetailHeader
          title={title}
          imageUri={imageUri}
          releaseLabel={formatReleaseLabel(movie?.release_date ?? releaseDate)}
          trailer={trailerAction}
          onGetTickets={() =>
            navigation.navigate('Showtimes', {
              movieId,
              title,
              releaseDate: movie?.release_date ?? releaseDate,
            })
          }
          onBack={navigation.goBack}
        />
        {renderBody()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  section: {
    paddingTop: spacing.xl - 3,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md + 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg + 2,
  },
  overview: {
    ...typography.overview,
    color: colors.textSecondary,
  },
  error: {
    paddingVertical: spacing.xxl,
  },
});
