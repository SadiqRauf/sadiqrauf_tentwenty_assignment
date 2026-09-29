import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { CloudOff, SearchX } from 'lucide-react-native';
import { useCallback, type ReactElement } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PaginationFooter } from '../../components/PaginationFooter';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import { useGenreNames } from '../../hooks/useGenres';
import type { useInfiniteMovies } from '../../hooks/useInfiniteMovies';
import { useMovieActions, useOpenMovie } from '../../hooks/useOpenMovie';
import type { MovieSummary } from '../../services/tmdb';
import { colors, spacing } from '../../theme';
import { MovieRow } from './MovieRow';

interface MovieResultsProps {
  result: ReturnType<typeof useInfiniteMovies>;
  emptyTitle: string;
  emptyMessage?: string;
  errorTitle: string;
  header?: ReactElement;
}

const keyExtractor = (movie: MovieSummary) => String(movie.id);
const Separator = () => <View style={styles.separator} />;

export function MovieResults({
  result,
  emptyTitle,
  emptyMessage,
  errorTitle,
  header,
}: MovieResultsProps) {
  const tabBarHeight = useTabBarHeight();
  const genreNames = useGenreNames();
  const openMovie = useOpenMovie();
  const showActions = useMovieActions();
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = result;

  const renderItem = useCallback<ListRenderItem<MovieSummary>>(
    ({ item }) => (
      <MovieRow
        movie={item}
        genreName={
          item.genre_ids?.[0] !== undefined
            ? genreNames.get(item.genre_ids[0])
            : undefined
        }
        onPress={openMovie}
        onMore={showActions}
      />
    ),
    [genreNames, openMovie, showActions],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const renderBody = () => {
    if (isPending) {
      return <ActivityIndicator style={styles.status} color={colors.accent} />;
    }
    if (isError && !data) {
      return (
        <StateMessage
          icon={CloudOff}
          title={errorTitle}
          message={error?.message}
          action={{ label: 'Try again', onPress: () => refetch() }}
        />
      );
    }
    if (!data || data.movies.length === 0) {
      return (
        <StateMessage
          icon={SearchX}
          title={emptyTitle}
          message={emptyMessage}
        />
      );
    }
    return null;
  };

  const body = renderBody();

  return (
    <View style={styles.container}>
      {body ? (
        <View style={[styles.state, { paddingBottom: tabBarHeight }]}>
          {header}
          {body}
        </View>
      ) : (
        <FlashList
          data={data?.movies}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={header}
          ListFooterComponent={
            <PaginationFooter
              isFetchingNextPage={isFetchingNextPage}
              isFetchNextPageError={isFetchNextPageError}
              onRetry={fetchNextPage}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={1.5}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_INSET,
            paddingBottom: tabBarHeight + spacing.lg,
          }}
          scrollIndicatorInsets={{ bottom: tabBarHeight }}
        />
      )}
    </View>
  );
}

const HORIZONTAL_INSET = spacing.lg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  state: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_INSET,
  },
  separator: {
    height: spacing.lg,
  },
  status: {
    marginTop: spacing.xxl,
  },
});
