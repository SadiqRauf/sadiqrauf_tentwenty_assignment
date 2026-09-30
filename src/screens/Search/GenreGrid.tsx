import { CloudOff } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { OfflineMessage } from '../../components/OfflineMessage';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import { useGenreTiles, type GenreTile as Tile } from '../../hooks/useGenres';
import { isOfflineWithoutData } from '../../hooks/useIsOnline';
import {
  columnsFor,
  useResponsiveLayout,
} from '../../hooks/useResponsiveLayout';
import { colors, radii, spacing } from '../../theme';
import { GenreTile } from './GenreTile';

const PLACEHOLDER_TILES = 10;
const keyExtractor = (tile: Tile) => String(tile.genre.id);

export function GenreGrid({ onSelect }: { onSelect: (tile: Tile) => void }) {
  const tabBarHeight = useTabBarHeight();
  const { tiles, isPending, fetchStatus, isError, refetch } = useGenreTiles();
  const layout = useResponsiveLayout();
  const columns = columnsFor(
    layout.contentWidth(spacing.lg),
    MIN_TILE_WIDTH,
    MAX_COLUMNS,
  );
  const tileWidth =
    (layout.contentWidth(spacing.lg) - GAP * (columns - 1)) / columns;
  const contentStyle = [
    styles.content,
    layout.gutter(spacing.lg),
    { paddingBottom: tabBarHeight + spacing.lg },
  ];

  if (isOfflineWithoutData({ isPending, fetchStatus })) {
    return <OfflineMessage subject="Genres" />;
  }

  if (isPending) {
    return (
      <View style={[contentStyle, styles.placeholderGrid]}>
        {Array.from({ length: PLACEHOLDER_TILES }, (_, index) => (
          <View
            key={index}
            style={[styles.placeholder, { width: tileWidth }]}
          />
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
      key={columns}
      data={tiles}
      keyExtractor={keyExtractor}
      numColumns={columns}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ width: tileWidth }}>
          <GenreTile tile={item} onPress={onSelect} />
        </View>
      )}
      columnWrapperStyle={columns > 1 ? styles.gap : undefined}
      contentContainerStyle={[contentStyle, styles.gap]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      scrollIndicatorInsets={{ bottom: tabBarHeight }}
    />
  );
}

const GAP = spacing.sm + 2;
const MIN_TILE_WIDTH = 150;
const MAX_COLUMNS = 4;

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
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
    aspectRatio: 163 / 100,
    borderRadius: radii.card,
    backgroundColor: colors.skeleton,
  },
});
