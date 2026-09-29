import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface StackHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  onBack: () => void;
}

export function StackHeader({
  title,
  subtitle,
  align = 'center',
  onBack,
}: StackHeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={spacing.md}
          style={styles.back}
        >
          <ChevronLeft color={colors.textPrimary} size={24} />
        </Pressable>
        <View style={align === 'center' ? styles.titles : styles.titlesLeft}>
          <Text
            style={styles.title}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const BACK_SLOT = 44;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  bar: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  back: {
    width: BACK_SLOT,
    height: BACK_SLOT,
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    alignItems: 'center',
    marginRight: BACK_SLOT,
  },
  titlesLeft: {
    flex: 1,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.headerSubtitle,
    color: colors.accent,
  },
});
