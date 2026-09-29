import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { CloudOff, Film, Search } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';
import { PaginationFooter } from '../../components/PaginationFooter';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import { useOpenMovie } from '../../hooks/useOpenMovie';
import {
  useRefreshUpcomingMovies,
  useUpcomingMovies,
} from '../../hooks/useUpcomingMovies';
import type { WatchStackParamList } from '../../navigation/types';
import type { MovieSummary } from '../../services/tmdb';
import { colors, spacing } from '../../theme';
import { MovieCard } from './MovieCard';
import { MovieListSkeleton } from './MovieListSkeleton';

const keyExtractor = (movie: MovieSummary) => String(movie.id);
const ItemSeparator = () => <View style={styles.separator} />;

type Props = NativeStackScreenProps<WatchStackParamList, 'MovieList'>;

export function MovieListScreen({ navigation }: Props) {
  const tabBarHeight = useTabBarHeight();
  const {
    data,
    error,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useUpcomingMovies();
  const movies = data?.movies;
  const refreshFromStart = useRefreshUpcomingMovies();

  const openMovie = useOpenMovie();
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

  const renderFooter = () => (
    <PaginationFooter
      isFetchingNextPage={isFetchingNextPage}
      isFetchNextPageError={isFetchNextPageError}
      onRetry={fetchNextPage}
    />
  );

  const renderContent = () => {
    if (isPending) {
      return <MovieListSkeleton />;
    }
    if (isError || !movies) {
      return (
        <StateMessage
          icon={CloudOff}
          title="Couldn't load upcoming movies"
          message={error?.message}
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
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search movies"
            onPress={() => navigation.navigate('Search')}
            hitSlop={12}
          >
            <Search color={colors.textPrimary} size={18} />
          </Pressable>
        }
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
});
