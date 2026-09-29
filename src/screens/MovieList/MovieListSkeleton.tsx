import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../../theme';
import { MOVIE_CARD_ASPECT_RATIO } from './MovieCard';

const PLACEHOLDER_COUNT = 4;

export function MovieListSkeleton() {
  const opacity = useRef(new Animated.Value(1)).current;

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
      style={styles.container}
      accessibilityLabel="Loading upcoming movies"
      accessibilityRole="progressbar"
    >
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <Animated.View key={index} style={[styles.card, { opacity }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
    flex: 1,
  },
  card: {
    aspectRatio: MOVIE_CARD_ASPECT_RATIO,
    borderRadius: radii.card,
    backgroundColor: colors.skeleton,
  },
});
