import { ImageOff } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomScrim } from '../../components/BottomScrim';
import { tmdbImageUrl, type MovieSummary } from '../../services/tmdb';
import { colors, radii, spacing, typography } from '../../theme';

export const MOVIE_CARD_ASPECT_RATIO = 335 / 180;

interface MovieCardProps {
  movie: MovieSummary;
  onPress?: (movie: MovieSummary) => void;
}

function MovieCardView({ movie, onPress }: MovieCardProps) {
  const [failed, setFailed] = useState(false);
  const uri =
    tmdbImageUrl(movie.backdrop_path, 'w780') ??
    tmdbImageUrl(movie.poster_path, 'w780');
  const showImage = uri && !failed;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={movie.title}
      onPress={onPress ? () => onPress(movie) : undefined}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {showImage ? (
        <Image
          key={movie.id}
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.fallback}>
          <ImageOff color={colors.textSecondary} size={28} strokeWidth={1.5} />
        </View>
      )}
      <BottomScrim />
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
    </Pressable>
  );
}

export const MovieCard = memo(MovieCardView);

const styles = StyleSheet.create({
  card: {
    aspectRatio: MOVIE_CARD_ASPECT_RATIO,
    borderRadius: radii.card,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.skeleton,
  },
  pressed: {
    opacity: 0.85,
  },
  fallback: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.cardTitle,
    color: colors.textOnImage,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
