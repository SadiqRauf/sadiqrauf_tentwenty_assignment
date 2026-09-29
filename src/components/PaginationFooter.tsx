import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from './Button';

interface PaginationFooterProps {
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  onRetry: () => void;
}

export function PaginationFooter({
  isFetchingNextPage,
  isFetchNextPageError,
  onRetry,
}: PaginationFooterProps) {
  if (isFetchingNextPage) {
    return (
      <ActivityIndicator style={styles.footer} color={colors.textPrimary} />
    );
  }
  if (isFetchNextPageError) {
    return (
      <View style={[styles.footer, styles.error]}>
        <Text style={styles.text}>Couldn't load more movies.</Text>
        <Button label="Retry" onPress={onRetry} />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: spacing.lg,
  },
  error: {
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
