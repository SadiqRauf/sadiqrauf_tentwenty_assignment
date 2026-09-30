import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { BottomScrim } from '../../components/BottomScrim';
import type { GenreTile as GenreTileData } from '../../hooks/useGenres';
import { useReconnectCount } from '../../hooks/useIsOnline';
import { tmdbImageUrl } from '../../services/tmdb';
import { colors, radii, spacing, typography } from '../../theme';

interface GenreTileProps {
  tile: GenreTileData;
  onPress: (tile: GenreTileData) => void;
}

export const GenreTile = memo(function GenreTileView({
  tile,
  onPress,
}: GenreTileProps) {
  const reconnects = useReconnectCount();
  const uri = tmdbImageUrl(tile.backdropPath, 'w300');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Browse ${tile.label}`}
      onPress={() => onPress(tile)}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      {uri ? (
        <Image
          key={reconnects}
          source={{ uri }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <BottomScrim start={0.3} opacity={0.75} />
      <Text style={styles.label} numberOfLines={1}>
        {tile.label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 163 / 100,
    borderRadius: radii.card,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.tabBar,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.sectionTitle,
    color: colors.textOnImage,
    paddingHorizontal: spacing.sm + 2,
    paddingBottom: spacing.lg,
  },
});
