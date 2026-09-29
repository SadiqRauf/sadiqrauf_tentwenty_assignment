import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Minus, Plus, TicketX } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { StackHeader } from '../../components/StackHeader';
import { StateMessage } from '../../components/StateMessage';
import { useShowtime } from '../../hooks/useShowtimes';
import type { RootStackParamList } from '../../navigation/types';
import type { Seat } from '../../services/booking';
import { colors, radii, spacing, typography } from '../../theme';
import { formatLongDate } from '../../utils/format';
import { ROW_LABEL_WIDTH, SeatMap } from './SeatMap';
import { SeatLegend } from './SeatLegend';
import { SelectedSeatChips } from './SelectedSeatChips';

const MAX_SEATS = 8;
const ZOOM_LEVELS = [1, 1.5, 2.25];

type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

export function SeatSelectionScreen({ route, navigation }: Props) {
  const { movieId, title, date, showtimeId } = route.params;
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const { data: showtime, isPending } = useShowtime(movieId, date, showtimeId);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoomIndex, setZoomIndex] = useState(0);

  const seatsById = useMemo(() => {
    const map = new Map<string, Seat>();
    showtime?.layout.forEach(row =>
      row.cells.forEach(cell => cell && map.set(cell.id, cell)),
    );
    return map;
  }, [showtime]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedSeats = selectedIds
    .map(id => seatsById.get(id))
    .filter((seat): seat is Seat => seat !== undefined);
  const total = showtime
    ? selectedSeats.reduce((sum, seat) => sum + showtime.prices[seat.kind], 0)
    : 0;

  const onToggle = useCallback((seat: Seat) => {
    setSelectedIds(ids => {
      if (ids.includes(seat.id)) {
        return ids.filter(id => id !== seat.id);
      }
      if (ids.length >= MAX_SEATS) {
        Alert.alert(
          'Seat limit reached',
          `You can book up to ${MAX_SEATS} seats at once.`,
        );
        return ids;
      }
      return [...ids, seat.id];
    });
  }, []);

  const onProceed = () => {
    const seatList = selectedSeats
      .map(seat => `Row ${seat.row} seat ${seat.number}`)
      .join(', ');
    Alert.alert(
      'Seats reserved',
      `${seatList}\nTotal: $${total}\n\nPayment isn't part of this demo.`,
      // Back past the date picker to the movie, where the journey started.
      [{ text: 'Done', onPress: () => navigation.pop(2) }],
    );
  };

  if (isPending) {
    return (
      <View style={styles.screen}>
        <StackHeader title={title} onBack={navigation.goBack} />
        <ActivityIndicator style={styles.status} color={colors.accent} />
      </View>
    );
  }

  if (!showtime) {
    return (
      <View style={styles.screen}>
        <StackHeader title={title} onBack={navigation.goBack} />
        <StateMessage
          icon={TicketX}
          title="This showtime is no longer available"
          action={{ label: 'Pick another', onPress: navigation.goBack }}
        />
      </View>
    );
  }

  const columns = Math.max(...showtime.layout.map(row => row.cells.length));
  const fitCellSize = (width - spacing.lg * 2 - ROW_LABEL_WIDTH) / columns;
  const cellSize = fitCellSize * ZOOM_LEVELS[zoomIndex];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <StackHeader
        title={title}
        subtitle={`${formatLongDate(date)}  |  ${showtime.time} ${
          showtime.hall
        }`}
        onBack={navigation.goBack}
      />

      <View style={styles.mapArea}>
        <ScrollView contentContainerStyle={styles.mapScrollVertical}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.mapScrollHorizontal}
          >
            <SeatMap
              layout={showtime.layout}
              cellSize={cellSize}
              selectedIds={selectedSet}
              prices={showtime.prices}
              onToggle={onToggle}
            />
          </ScrollView>
        </ScrollView>
        <View style={styles.zoom}>
          <ZoomButton
            icon={Plus}
            label="Zoom in"
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            onPress={() => setZoomIndex(i => i + 1)}
          />
          <ZoomButton
            icon={Minus}
            label="Zoom out"
            disabled={zoomIndex === 0}
            onPress={() => setZoomIndex(i => i - 1)}
          />
        </View>
      </View>

      <View style={[styles.panel, { paddingBottom: bottom + spacing.lg }]}>
        <SeatLegend prices={showtime.prices} />
        <View style={styles.chips}>
          <SelectedSeatChips seats={selectedSeats} onRemove={onToggle} />
        </View>
        <View style={styles.checkout}>
          <View style={styles.total} accessible>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>$ {total}</Text>
          </View>
          <Button
            label="Proceed to pay"
            size="large"
            disabled={selectedSeats.length === 0}
            onPress={onProceed}
            style={styles.proceed}
          />
        </View>
      </View>
    </View>
  );
}

interface ZoomButtonProps {
  icon: typeof Plus;
  label: string;
  disabled: boolean;
  onPress: () => void;
}

function ZoomButton({ icon: Icon, label, disabled, onPress }: ZoomButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={spacing.xs}
      style={[styles.zoomButton, disabled && styles.zoomButtonDisabled]}
    >
      <Icon color={colors.textPrimary} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  status: {
    marginTop: spacing.xxl,
  },
  mapArea: {
    flex: 1,
  },
  mapScrollVertical: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  mapScrollHorizontal: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + spacing.sm,
  },
  zoom: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  zoomButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.scrim,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  zoomButtonDisabled: {
    opacity: 0.4,
  },
  panel: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl - 2,
  },
  chips: {
    marginTop: spacing.xl,
  },
  checkout: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    marginTop: spacing.xl,
  },
  total: {
    height: 50,
    minWidth: 106,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
    backgroundColor: colors.mutedFill,
    justifyContent: 'center',
  },
  totalLabel: {
    ...typography.micro,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.price,
    color: colors.textPrimary,
  },
  proceed: {
    flex: 1,
  },
});
