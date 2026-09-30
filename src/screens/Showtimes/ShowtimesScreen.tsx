import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarX2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { StackHeader } from '../../components/StackHeader';
import { StateMessage } from '../../components/StateMessage';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useShowtimes } from '../../hooks/useShowtimes';
import type { RootStackParamList } from '../../navigation/types';
import { getShowDates, type Showtime } from '../../services/booking';
import { colors, spacing, typography } from '../../theme';
import { formatReleaseLabel } from '../../utils/format';
import { DateChips } from './DateChips';
import { ShowtimeCard } from './ShowtimeCard';

const PORTRAIT_TOP_GAP = 100;

type Props = NativeStackScreenProps<RootStackParamList, 'Showtimes'>;

export function ShowtimesScreen({ route, navigation }: Props) {
  const { movieId, title, releaseDate } = route.params;
  const { bottom } = useSafeAreaInsets();
  const layout = useResponsiveLayout();

  const dates = useMemo(() => getShowDates(releaseDate), [releaseDate]);
  const [date, setDate] = useState(dates[0]);
  const {
    data: showtimes,
    isPending,
    isError,
    refetch,
  } = useShowtimes(movieId, date);

  const [showtimeId, setShowtimeId] = useState<string>();
  const selected =
    showtimes?.find(showtime => showtime.id === showtimeId) ?? showtimes?.[0];
  const onSelectShowtime = useCallback(
    (showtime: Showtime) => setShowtimeId(showtime.id),
    [],
  );

  const renderShowtimes = () => {
    if (isPending) {
      return <ActivityIndicator style={styles.status} color={colors.accent} />;
    }
    if (isError || !showtimes.length) {
      return (
        <StateMessage
          icon={CalendarX2}
          title="No showtimes for this date"
          message="Try another day."
          action={isError ? { label: 'Retry', onPress: refetch } : undefined}
        />
      );
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.showtimes}
      >
        {showtimes.map(showtime => (
          <ShowtimeCard
            key={showtime.id}
            showtime={showtime}
            selected={showtime.id === selected?.id}
            onSelect={onSelectShowtime}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.screen}>
      <StackHeader
        title={title}
        subtitle={formatReleaseLabel(releaseDate)}
        onBack={navigation.goBack}
      />
      <ScrollView
        contentContainerStyle={[
          {
            paddingTop: layout.isLandscape ? spacing.lg : PORTRAIT_TOP_GAP,
            paddingLeft: layout.insets.left,
            paddingRight: layout.insets.right,
          },
          styles.content,
        ]}
      >
        <Text style={styles.sectionTitle}>Date</Text>
        <DateChips dates={dates} selected={date} onSelect={setDate} />
        <View style={styles.showtimesArea}>{renderShowtimes()}</View>
      </ScrollView>
      <View
        style={[
          styles.footer,
          layout.gutter(spacing.lg),
          { paddingBottom: bottom + spacing.lg },
        ]}
      >
        <Button
          label="Select Seats"
          size="large"
          style={styles.cta}
          disabled={!selected}
          onPress={() =>
            selected &&
            navigation.navigate('SeatSelection', {
              movieId,
              title,
              date,
              showtimeId: selected.id,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  showtimesArea: {
    marginTop: spacing.xxl,
    minHeight: 220,
  },
  showtimes: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md + 3,
  },
  status: {
    marginTop: spacing.xxl,
  },
  footer: {
    paddingTop: spacing.md,
  },
  cta: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
