import { StyleSheet, Text, View } from 'react-native';
import type { Genre } from '../../services/tmdb';
import { colors, radii, spacing, typography } from '../../theme';

export function GenreChips({ genres }: { genres: Genre[] }) {
  return (
    <View style={styles.row}>
      {genres.map((genre, index) => (
        <View
          key={genre.id}
          style={[
            styles.chip,
            { backgroundColor: colors.genres[index % colors.genres.length] },
          ]}
        >
          <Text style={styles.label}>{genre.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 1,
  },
  chip: {
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.chip,
    color: colors.textOnImage,
  },
});
