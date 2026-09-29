import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';
import { formatLongDate, formatShortDate } from '../../utils/format';

interface DateChipsProps {
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
}

export function DateChips({ dates, selected, onSelect }: DateChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {dates.map(date => {
        const isSelected = date === selected;
        return (
          <Pressable
            key={date}
            accessibilityRole="button"
            accessibilityLabel={formatLongDate(date)}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(date)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {formatShortDate(date)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm,
  },
  chip: {
    minWidth: 67,
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.button,
    backgroundColor: colors.mutedFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    ...typography.captionStrong,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.textOnImage,
  },
});
