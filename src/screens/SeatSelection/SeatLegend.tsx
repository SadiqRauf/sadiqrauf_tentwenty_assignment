import { StyleSheet, Text, View } from 'react-native';
import { SeatGlyph } from '../../components/SeatGlyph';
import type { SeatKind } from '../../services/booking';
import { colors, spacing, typography } from '../../theme';

export function SeatLegend({ prices }: { prices: Record<SeatKind, number> }) {
  const items = [
    { label: 'Selected', color: colors.seatSelected },
    { label: 'Not available', color: colors.seatUnavailable },
    { label: `VIP (${prices.vip}$)`, color: colors.seatVip },
    { label: `Regular (${prices.regular} $)`, color: colors.seatRegular },
  ];

  return (
    <View style={styles.grid}>
      {items.map(item => (
        <View key={item.label} style={styles.item}>
          <SeatGlyph size={17} color={item.color} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md + 4,
  },
  item: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md + 1,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
