import { Ellipsis, ImageOff } from 'lucide-react-native';
import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { tmdbImageUrl, type MovieSummary } from '../../services/tmdb';
import { colors, radii, spacing, typography } from '../../theme';

interface MovieRowProps {
  movie: MovieSummary;
  genreName?: string;
  onPress: (movie: MovieSummary) => void;
  onMore: (movie: MovieSummary) => void;
}

export const MovieRow = memo(function MovieRowView({
  movie,
  genreName,
  onPress,
  onMore,
}: MovieRowProps) {
  const uri =
    tmdbImageUrl(movie.backdrop_path, 'w300') ??
    tmdbImageUrl(movie.poster_path, 'w342');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        genreName ? `${movie.title}, ${genreName}` : movie.title
      }
      onPress={() => onPress(movie)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.thumb}>
        {uri ? (
          <Image
            key={movie.id}
            source={{ uri }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <ImageOff color={colors.textSecondary} size={22} strokeWidth={1.5} />
        )}
      </View>
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        {genreName ? (
          <Text style={styles.genre} numberOfLines={1}>
            {genreName}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`More options for ${movie.title}`}
        onPress={() => onMore(movie)}
        hitSlop={spacing.md}
        style={styles.more}
      >
        <Ellipsis color={colors.accent} size={22} />
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg + 1,
  },
  pressed: {
    opacity: 0.7,
  },
  thumb: {
    width: 130,
    height: 100,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  genre: {
    ...typography.captionMedium,
    color: colors.textMuted,
  },
  more: {
    paddingVertical: spacing.sm,
  },
});
