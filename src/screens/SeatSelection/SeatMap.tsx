import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { SeatGlyph } from '../../components/SeatGlyph';
import { seatColor } from '../../components/seatColor';
import type { Seat, SeatRow } from '../../services/booking';
import { colors, fonts, spacing, typography } from '../../theme';

export const ROW_LABEL_WIDTH = 16;
const SCREEN_HEIGHT = 34;

interface SeatMapProps {
  layout: SeatRow[];
  cellSize: number;
  selectedIds: ReadonlySet<string>;
  prices: Record<Seat['kind'], number>;
  onToggle: (seat: Seat) => void;
}

interface SeatButtonProps {
  seat: Seat;
  size: number;
  selected: boolean;
  price: number;
  onToggle: (seat: Seat) => void;
}

const SeatButton = memo(function SeatButtonView({
  seat,
  size,
  selected,
  price,
  onToggle,
}: SeatButtonProps) {
  const kindLabel = seat.kind === 'vip' ? 'VIP' : 'regular';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Row ${seat.row}, seat ${seat.number}, ${kindLabel}, ${price} dollars`}
      accessibilityState={{ selected, disabled: !seat.available }}
      disabled={!seat.available}
      onPress={() => onToggle(seat)}
      style={[styles.cell, { width: size, height: size }]}
    >
      <SeatGlyph size={size * 0.78} color={seatColor(seat, selected)} />
    </Pressable>
  );
});

export function SeatMap({
  layout,
  cellSize,
  selectedIds,
  prices,
  onToggle,
}: SeatMapProps) {
  const columns = Math.max(...layout.map(row => row.cells.length));
  const seatsWidth = columns * cellSize;

  return (
    <View>
      <View style={{ marginLeft: ROW_LABEL_WIDTH }}>
        <Svg width={seatsWidth} height={SCREEN_HEIGHT}>
          <Path
            d={`M 2 ${SCREEN_HEIGHT - 6} Q ${seatsWidth / 2} 0 ${
              seatsWidth - 2
            } ${SCREEN_HEIGHT - 6}`}
            stroke={colors.accent}
            strokeWidth={1}
            fill="none"
          />
          <SvgText
            x={seatsWidth / 2}
            y={SCREEN_HEIGHT - 12}
            fontSize={8}
            fontFamily={fonts.regular}
            fill={colors.textSecondary}
            textAnchor="middle"
          >
            SCREEN
          </SvgText>
        </Svg>
      </View>
      {layout.map(({ row, cells }) => (
        <View key={row} style={styles.row}>
          <Text style={[styles.rowLabel, { lineHeight: cellSize }]}>{row}</Text>
          {cells.map((cell, column) =>
            cell ? (
              <SeatButton
                key={cell.id}
                seat={cell}
                size={cellSize}
                selected={selectedIds.has(cell.id)}
                price={prices[cell.kind]}
                onToggle={onToggle}
              />
            ) : (
              <View
                key={`gap-${column}`}
                style={{ width: cellSize, height: cellSize }}
              />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowLabel: {
    ...typography.seatLabel,
    width: ROW_LABEL_WIDTH,
    color: colors.textPrimary,
    paddingRight: spacing.xs,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
