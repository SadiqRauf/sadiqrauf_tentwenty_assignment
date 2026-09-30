import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Minus, Plus, TicketX } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { StackHeader } from '../../components/StackHeader';
import { StateMessage } from '../../components/StateMessage';
import { MAX_SEATS, useSeatSelection } from '../../hooks/useSeatSelection';
import { useBookSeats, useShowtime } from '../../hooks/useShowtimes';
import type { RootStackParamList } from '../../navigation/types';
import { columnCount } from '../../services/booking';
import { colors, radii, spacing, typography } from '../../theme';
import { formatLongDate } from '../../utils/format';
import { ROW_LABEL_WIDTH, SCREEN_HEIGHT, SeatMap } from './SeatMap';
import { SeatLegend } from './SeatLegend';
import { SelectedSeatChips } from './SelectedSeatChips';

const ZOOM_LEVELS = [1, 1.5, 2.25];
const MIN_CELL_SIZE = 8;
const SIDE_PANEL_WIDTH = 340;
const MAP_PADDING_HORIZONTAL = spacing.lg * 2;
const MAP_PADDING_VERTICAL = spacing.lg * 2 + spacing.xxl + spacing.sm;

type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

export function SeatSelectionScreen({ route, navigation }: Props) {
  const { movieId, title, date, showtimeId } = route.params;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const [mapSize, setMapSize] = useState<{ width: number; height: number }>();
  const { data: showtime, isPending } = useShowtime(movieId, date, showtimeId);

  const [zoomIndex, setZoomIndex] = useState(0);
  const { selectedIds, selectedSeats, total, toggle, rejections } =
    useSeatSelection(showtime);

  useEffect(() => {
    if (rejections > 0) {
      Alert.alert(
        'Seat limit reached',
        `You can book up to ${MAX_SEATS} seats at once.`,
      );
    }
  }, [rejections]);

  const bookSeats = useBookSeats(movieId, date);

  const onProceed = () => {
    if (!showtime) {
      return;
    }
    bookSeats.mutate({
      movieId,
      showtimeId: showtime.id,
      seatIds: selectedSeats.map(seat => seat.id),
      total,
    });
    const seatList = selectedSeats
      .map(seat => `Row ${seat.row} seat ${seat.number}`)
      .join(', ');
    Alert.alert(
      'Seats reserved',
      `${seatList}\nTotal: $${total}\n\nSaved on this device. Payment isn't part of this demo.`,
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

  const availableWidth =
    (mapSize?.width ?? width) - MAP_PADDING_HORIZONTAL - ROW_LABEL_WIDTH;
  const availableHeight = mapSize
    ? mapSize.height - MAP_PADDING_VERTICAL - SCREEN_HEIGHT
    : Infinity;
  const fitCellSize = Math.max(
    MIN_CELL_SIZE,
    Math.min(
      availableWidth / columnCount(showtime.layout),
      availableHeight / showtime.layout.length,
    ),
  );
  const cellSize = fitCellSize * ZOOM_LEVELS[zoomIndex];

  const panel = (
    <>
      <SeatLegend prices={showtime.prices} />
      <View style={styles.chips}>
        <SelectedSeatChips seats={selectedSeats} onRemove={toggle} />
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
    </>
  );

  return (
    <View style={styles.screen}>
      <StackHeader
        title={title}
        subtitle={`${formatLongDate(date)}  |  ${showtime.time} ${
          showtime.hall
        }`}
        onBack={navigation.goBack}
      />

      <View style={[styles.body, isLandscape && styles.bodyLandscape]}>
        <View
          style={[
            styles.mapArea,
            {
              paddingLeft: insets.left,
              paddingRight: isLandscape ? 0 : insets.right,
              paddingBottom: isLandscape ? insets.bottom : 0,
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.mapScrollVertical}
            onLayout={event => setMapSize(event.nativeEvent.layout)}
          >
            <ScrollView
              horizontal
              contentContainerStyle={styles.mapScrollHorizontal}
            >
              <SeatMap
                layout={showtime.layout}
                cellSize={cellSize}
                selectedIds={selectedIds}
                prices={showtime.prices}
                onToggle={toggle}
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

        {isLandscape ? (
          <ScrollView
            style={styles.sidePanel}
            contentContainerStyle={[
              styles.panel,
              {
                paddingRight: spacing.lg + insets.right,
                paddingBottom: insets.bottom + spacing.lg,
              },
            ]}
          >
            {panel}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.panel,
              {
                paddingLeft: spacing.lg + insets.left,
                paddingRight: spacing.lg + insets.right,
                paddingBottom: insets.bottom + spacing.lg,
              },
            ]}
          >
            {panel}
          </View>
        )}
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
  body: {
    flex: 1,
  },
  bodyLandscape: {
    flexDirection: 'row',
  },
  mapArea: {
    flex: 1,
  },
  sidePanel: {
    width: SIDE_PANEL_WIDTH,
    flexGrow: 0,
    backgroundColor: colors.surface,
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
    paddingLeft: spacing.lg,
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
