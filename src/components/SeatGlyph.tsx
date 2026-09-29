import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

export const SeatGlyph = memo(function SeatGlyphView({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  const radius = size * 0.22;
  return (
    <View style={{ width: size }}>
      <View
        style={[
          styles.back,
          {
            height: size * 0.62,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={{
          height: size * 0.18,
          marginTop: size * 0.08,
          borderRadius: size * 0.08,
          backgroundColor: color,
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  back: {
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
});
