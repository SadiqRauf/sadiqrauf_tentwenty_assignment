import { useNavigation } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { CloudOff, Film, Search } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import {
  useRefreshUpcomingMovies,
  useUpcomingMovies,
} from '../../hooks/useUpcomingMovies';
import type { MovieSummary } from '../../services/tmdb';
import { colors, spacing, typography } from '../../theme';
import { MovieCard } from './MovieCard';
import { MovieListSkeleton } from './MovieListSkeleton';

const keyExtractor = (movie: MovieSummary) => String(movie.id);
const ItemSeparator = () => <View style={styles.separator} />;

export function MovieListScreen() {
  const tabBarHeight = useTabBarHeight();
  const navigation = useNavigation();
  const {
    data: movies,
    error,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useUpcomingMovies();
  const refreshFromStart = useRefreshUpcomingMovies();

  const openMovie = useCallback(
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
  const renderItem = useCallback<ListRenderItem<MovieSummary>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} />,
    [openMovie],
  );

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    try {
      await refreshFromStart();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [refreshFromStart]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <ActivityIndicator style={styles.footer} color={colors.textPrimary} />
      );
    }
    if (isFetchNextPageError) {
      return (
        <View style={[styles.footer, styles.footerError]}>
          <Text style={styles.footerText}>Couldn't load more movies.</Text>
          <Button label="Retry" onPress={() => fetchNextPage()} />
        </View>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (isPending) {
      return <MovieListSkeleton />;
    }
    if (isError && !movies) {
      return (
        <StateMessage
          icon={CloudOff}
          title="Couldn't load upcoming movies"
          message={error.message}
          action={{ label: 'Try again', onPress: () => refetch() }}
        />
      );
    }
    if (movies.length === 0) {
      return (
        <StateMessage
          icon={Film}
          title="Nothing upcoming yet"
          message="Check back soon for new releases."
          action={{ label: 'Refresh', onPress: onRefresh }}
        />
      );
    }
    return (
      <FlashList
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={1.5}
        refreshing={isPullRefreshing}
        onRefresh={onRefresh}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + spacing.lg },
        ]}
        scrollIndicatorInsets={{ bottom: tabBarHeight }}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Watch"
        right={<Search color={colors.textPrimary} size={18} />}
      />
      <View style={[styles.body, isPending && { paddingBottom: tabBarHeight }]}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  separator: {
    height: spacing.lg,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  footerError: {
    alignItems: 'center',
    gap: spacing.md,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
