import { X } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Seat } from '../../services/booking';
import { colors, radii, spacing, typography } from '../../theme';

interface SelectedSeatChipsProps {
  seats: Seat[];
  onRemove: (seat: Seat) => void;
}

export function SelectedSeatChips({ seats, onRemove }: SelectedSeatChipsProps) {
  if (seats.length === 0) {
    return <Text style={styles.hint}>Tap a seat on the map to select it.</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {seats.map(seat => (
        <View key={seat.id} style={styles.chip}>
          <Text style={styles.number}>
            {seat.number}
            <Text style={styles.rowSuffix}> / {seat.row} row</Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove row ${seat.row}, seat ${seat.number}`}
            onPress={() => onRemove(seat)}
            hitSlop={spacing.sm}
          >
            <X color={colors.textPrimary} size={14} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  chip: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.button,
    backgroundColor: colors.mutedFill,
  },
  number: {
    ...typography.price,
    color: colors.textPrimary,
  },
  rowSuffix: {
    ...typography.micro,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 30,
  },
});
