import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors, radii, spacing } from '../../theme';
import { MOVIE_CARD_ASPECT_RATIO } from './MovieCard';

const ROWS = 4;

export function MovieListSkeleton({ columns = 1 }: { columns?: number }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const layout = useResponsiveLayout();

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View
      style={[styles.container, layout.gutter(spacing.lg)]}
      accessibilityLabel="Loading upcoming movies"
      accessibilityRole="progressbar"
    >
      {Array.from({ length: ROWS }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: columns }, (__, column) => (
            <Animated.View key={column} style={[styles.card, { opacity }]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  card: {
    flex: 1,
    aspectRatio: MOVIE_CARD_ASPECT_RATIO,
    borderRadius: radii.card,
    backgroundColor: colors.skeleton,
  },
});
