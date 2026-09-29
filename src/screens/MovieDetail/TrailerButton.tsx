import { Play } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

interface TrailerButtonProps {
  loading: boolean;
  onPress?: () => void;
}

export function TrailerButton({ loading, onPress }: TrailerButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Watch trailer"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnImage} />
      ) : (
        <>
          <Play
            color={colors.textOnImage}
            fill={colors.textOnImage}
            size={14}
          />
          <Text style={styles.label}>Watch Trailer</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 243,
    height: 50,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: 'rgba(97, 195, 242, 0.2)',
  },
  label: {
    ...typography.button,
    color: colors.textOnImage,
  },
});
