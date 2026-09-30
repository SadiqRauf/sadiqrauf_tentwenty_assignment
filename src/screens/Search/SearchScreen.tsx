import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { GenreTile } from '../../hooks/useGenres';
import { normaliseQuery, useMovieSearch } from '../../hooks/useMovieSearch';
import type { WatchStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { GenreGrid } from './GenreGrid';
import { MovieResults } from './MovieResults';
import { SearchBar } from './SearchBar';

const SEARCH_DEBOUNCE_MS = 300;

type Props = NativeStackScreenProps<WatchStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, SEARCH_DEBOUNCE_MS);
  const search = useMovieSearch(debounced);
  const hasQuery = normaliseQuery(text).length > 0;
  const isUpdating =
    normaliseQuery(text) !== normaliseQuery(debounced) || search.isFetching;

  const onClear = () => {
    if (text) {
      setText('');
    } else {
      navigation.goBack();
    }
  };

  const onSubmit = () => {
    if (!hasQuery) {
      return;
    }
    Keyboard.dismiss();
    navigation.navigate('SearchResults', { kind: 'query', query: text.trim() });
  };

  const onSelectGenre = useCallback(
    (tile: GenreTile) =>
      navigation.navigate('SearchResults', {
        kind: 'genre',
        genreId: tile.genre.id,
        genreName: tile.label,
      }),
    [navigation],
  );

  return (
    <View style={styles.screen}>
      <SearchBar
        value={text}
        onChangeText={setText}
        onSubmit={onSubmit}
        onClear={onClear}
      />
      {hasQuery ? (
        <MovieResults
          result={search}
          emptyTitle={`No results for "${text.trim()}"`}
          emptyMessage="Check the spelling or try another title."
          errorTitle="Search isn't available right now"
          offlineSubject="Search results"
          header={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Top Results</Text>
              {isUpdating ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : null}
            </View>
          }
        />
      ) : (
        <GenreGrid onSelect={onSelectGenre} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg + 2,
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    minHeight: 30,
  },
  resultsTitle: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
});
