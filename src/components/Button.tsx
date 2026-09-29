import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export function Button({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={spacing.sm}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.button,
    backgroundColor: colors.tabBar,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...typography.button,
    color: colors.tabActive,
  },
});
