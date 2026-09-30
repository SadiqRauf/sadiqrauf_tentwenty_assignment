import { WifiOff } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsOnline } from '../hooks/useIsOnline';
import { colors, spacing, typography } from '../theme';

export function OfflineBanner() {
  const isOnline = useIsOnline();
  const { top } = useSafeAreaInsets();

  if (isOnline) {
    return null;
  }

  return (
    <View
      style={[styles.container, { top: top + spacing.xs }]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View style={styles.pill}>
        <WifiOff color={colors.textOnImage} size={12} />
        <Text style={styles.label}>Offline · showing saved data</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.tabBar,
  },
  label: {
    ...typography.micro,
    color: colors.textOnImage,
  },
});
