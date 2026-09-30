import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { CloudOff, Film, Search } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';
import { OfflineMessage } from '../../components/OfflineMessage';
import { PaginationFooter } from '../../components/PaginationFooter';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import { isOfflineWithoutData } from '../../hooks/useIsOnline';
import { useOpenMovie } from '../../hooks/useOpenMovie';
import {
  columnsFor,
  useResponsiveLayout,
} from '../../hooks/useResponsiveLayout';
import {
  useRefreshUpcomingMovies,
  useUpcomingMovies,
} from '../../hooks/useUpcomingMovies';
import type { WatchStackParamList } from '../../navigation/types';
import type { MovieSummary } from '../../services/tmdb';
import { colors, spacing } from '../../theme';
import { MovieCard } from './MovieCard';
import { MovieListSkeleton } from './MovieListSkeleton';

const CARD_GAP = spacing.lg;
const MIN_CARD_WIDTH = 320;
const MAX_COLUMNS = 3;

const keyExtractor = (movie: MovieSummary) => String(movie.id);
const ItemSeparator = () => <View style={styles.separator} />;

type Props = NativeStackScreenProps<WatchStackParamList, 'MovieList'>;

export function MovieListScreen({ navigation }: Props) {
  const tabBarHeight = useTabBarHeight();
  const layout = useResponsiveLayout();
  const columns = columnsFor(
    layout.contentWidth(spacing.lg),
    MIN_CARD_WIDTH,
    MAX_COLUMNS,
  );
  const {
    data,
    error,
    isPending,
    fetchStatus,
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
    ({ item }) => (
      <View style={styles.cell}>
        <MovieCard movie={item} onPress={openMovie} />
      </View>
    ),
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
    if (isOfflineWithoutData({ isPending, fetchStatus })) {
      return <OfflineMessage subject="Upcoming movies" />;
    }
    if (isPending) {
      return <MovieListSkeleton columns={columns} />;
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
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={1.5}
        refreshing={isPullRefreshing}
        onRefresh={onRefresh}
        contentContainerStyle={[
          styles.content,
          layout.gutter(spacing.lg - CARD_GAP / 2),
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
    paddingTop: spacing.xl,
  },
  cell: {
    flex: 1,
    paddingHorizontal: CARD_GAP / 2,
  },
  separator: {
    height: spacing.lg,
  },
});
