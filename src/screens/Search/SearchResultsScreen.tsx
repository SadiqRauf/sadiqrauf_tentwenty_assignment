import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { StackHeader } from '../../components/StackHeader';
import { useMovieSearch, useMoviesByGenre } from '../../hooks/useMovieSearch';
import type { WatchStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';
import { formatResultCount } from '../../utils/format';
import { MovieResults } from './MovieResults';

type Props = NativeStackScreenProps<WatchStackParamList, 'SearchResults'>;

function QueryResults({
  query,
  onBack,
}: {
  query: string;
  onBack: () => void;
}) {
  const result = useMovieSearch(query);
  return (
    <>
      <StackHeader
        title={formatResultCount(result.data?.total)}
        align="left"
        onBack={onBack}
      />
      <MovieResults
        result={result}
        emptyTitle={`No results for "${query}"`}
        emptyMessage="Check the spelling or try another title."
        errorTitle="Search isn't available right now"
        header={<View style={styles.spacer} />}
      />
    </>
  );
}

function GenreResults({
  genreId,
  genreName,
  onBack,
}: {
  genreId: number;
  genreName: string;
  onBack: () => void;
}) {
  const result = useMoviesByGenre(genreId);
  return (
    <>
      <StackHeader title={genreName} align="left" onBack={onBack} />
      <MovieResults
        result={result}
        emptyTitle={`No ${genreName.toLowerCase()} yet`}
        errorTitle={`Couldn't load ${genreName.toLowerCase()}`}
        header={<View style={styles.spacer} />}
      />
    </>
  );
}

export function SearchResultsScreen({ route, navigation }: Props) {
  const { params } = route;
  return (
    <View style={styles.screen}>
      {params.kind === 'query' ? (
        <QueryResults query={params.query} onBack={navigation.goBack} />
      ) : (
        <GenreResults
          genreId={params.genreId}
          genreName={params.genreName}
          onBack={navigation.goBack}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  spacer: {
    height: spacing.lg + 2,
  },
});
