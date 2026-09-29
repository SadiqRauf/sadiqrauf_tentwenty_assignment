import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from './Button';

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  message?: string;
  action?: { label: string; onPress: () => void };
}

export function StateMessage({
  icon: Icon,
  title,
  message,
  action,
}: StateMessageProps) {
  return (
    <View style={styles.container}>
      <Icon color={colors.textSecondary} size={40} strokeWidth={1.5} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? (
        <View style={styles.action}>
          <Button label={action.label} onPress={action.onPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
  },
});
