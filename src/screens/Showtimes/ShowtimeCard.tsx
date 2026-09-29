import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HallPreview } from '../../components/HallPreview';
import type { Showtime } from '../../services/booking';
import { colors, radii, spacing, typography } from '../../theme';

export const SHOWTIME_CARD_WIDTH = 249;
const PREVIEW_HEIGHT = 145;

interface ShowtimeCardProps {
  showtime: Showtime;
  selected: boolean;
  onSelect: (showtime: Showtime) => void;
}

export const ShowtimeCard = memo(function ShowtimeCardView({
  showtime,
  selected,
  onSelect,
}: ShowtimeCardProps) {
  const { time, cinema, hall, prices, bonusFrom } = showtime;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${time}, ${cinema} ${hall}, from ${prices.regular} dollars or ${bonusFrom} bonus`}
      accessibilityState={{ selected }}
      onPress={() => onSelect(showtime)}
      style={styles.container}
    >
      <Text style={styles.heading} numberOfLines={1}>
        <Text style={styles.time}>{time}</Text>
        {'   '}
        {cinema} + {hall}
      </Text>
      <View style={[styles.preview, selected && styles.previewSelected]}>
        <HallPreview
          layout={showtime.layout}
          width={SHOWTIME_CARD_WIDTH - 2}
          height={PREVIEW_HEIGHT - 2}
        />
      </View>
      <Text style={styles.price}>
        From <Text style={styles.priceStrong}>{prices.regular}$</Text> or{' '}
        <Text style={styles.priceStrong}>{bonusFrom} bonus</Text>
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: SHOWTIME_CARD_WIDTH,
  },
  heading: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm - 1,
  },
  time: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  preview: {
    height: PREVIEW_HEIGHT,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  previewSelected: {
    borderColor: colors.accent,
  },
  price: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md + 2,
  },
  priceStrong: {
    ...typography.captionStrong,
    color: colors.textPrimary,
  },
});
