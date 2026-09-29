import { StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../../theme';

const CHIP_WIDTHS = [64, 72, 58];
const LINE_WIDTHS = ['100%', '100%', '92%', '60%'] as const;

export function DetailBodySkeleton() {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading movie details"
    >
      <View style={styles.heading} />
      <View style={styles.chips}>
        {CHIP_WIDTHS.map(width => (
          <View key={width} style={[styles.chip, { width }]} />
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.heading} />
      {LINE_WIDTHS.map((width, index) => (
        <View key={index} style={[styles.line, { width }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl - 3,
  },
  heading: {
    width: 90,
    height: 16,
    borderRadius: radii.button / 2,
    backgroundColor: colors.skeleton,
    marginBottom: spacing.md + 6,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.xs + 1,
  },
  chip: {
    height: 26,
    borderRadius: radii.chip,
    backgroundColor: colors.skeleton,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg + 2,
  },
  line: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.skeleton,
    marginBottom: spacing.sm + 1,
  },
});
