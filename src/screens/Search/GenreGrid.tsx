import { CloudOff } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import { useGenreTiles, type GenreTile as Tile } from '../../hooks/useGenres';
import { colors, radii, spacing } from '../../theme';
import { GenreTile } from './GenreTile';

const PLACEHOLDER_TILES = 10;
const keyExtractor = (tile: Tile) => String(tile.genre.id);

export function GenreGrid({ onSelect }: { onSelect: (tile: Tile) => void }) {
  const tabBarHeight = useTabBarHeight();
  const { tiles, isPending, isError, refetch } = useGenreTiles();
  const contentStyle = [
    styles.content,
    { paddingBottom: tabBarHeight + spacing.lg },
  ];

  if (isPending) {
    return (
      <View style={[contentStyle, styles.placeholderGrid]}>
        {Array.from({ length: PLACEHOLDER_TILES }, (_, index) => (
          <View key={index} style={styles.placeholder} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateMessage
        icon={CloudOff}
        title="Couldn't load genres"
        message="You can still search by title above."
        action={{ label: 'Try again', onPress: () => refetch() }}
      />
    );
  }

  return (
    <FlatList
      data={tiles}
      keyExtractor={keyExtractor}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <GenreTile tile={item} onPress={onSelect} />}
      columnWrapperStyle={styles.gap}
      contentContainerStyle={[contentStyle, styles.gap]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      scrollIndicatorInsets={{ bottom: tabBarHeight }}
    />
  );
}

const GAP = spacing.sm + 2;

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  gap: {
    gap: GAP,
  },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  placeholder: {
    width: `${50 - 2}%`,
    flexGrow: 1,
    aspectRatio: 163 / 100,
    borderRadius: radii.card,
    backgroundColor: colors.skeleton,
  },
});
