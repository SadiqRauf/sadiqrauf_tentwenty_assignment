import { FlatList, Image, StyleSheet, View } from 'react-native';
import { tmdbImageUrl, type ImageAsset } from '../../services/tmdb';
import { colors, radii, spacing } from '../../theme';

const THUMB_WIDTH = 200;

interface ImageStripProps {
  images: ImageAsset[];
  inset: number;
}

const keyExtractor = (image: ImageAsset) => image.file_path;
const Gap = () => <View style={styles.gap} />;

export function ImageStrip({ images, inset }: ImageStripProps) {
  return (
    <FlatList
      horizontal
      data={images}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={Gap}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: inset }}
      renderItem={({ item }) => (
        <Image
          source={{ uri: tmdbImageUrl(item.file_path, 'w300') }}
          style={[styles.thumb, { aspectRatio: item.aspect_ratio }]}
          accessibilityIgnoresInvertColors
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: THUMB_WIDTH,
    borderRadius: radii.card,
    backgroundColor: colors.skeleton,
  },
  gap: {
    width: spacing.sm + 2,
  },
});
