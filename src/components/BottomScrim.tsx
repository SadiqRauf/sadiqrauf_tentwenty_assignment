import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

interface BottomScrimProps {
  start?: number;
  opacity?: number;
}

function BottomScrimView({ start = 0.4, opacity = 0.7 }: BottomScrimProps) {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="bottomScrim" x1="0" y1="0" x2="0" y2="1">
          <Stop offset={start} stopColor={colors.scrim} stopOpacity={0} />
          <Stop offset={1} stopColor={colors.scrim} stopOpacity={opacity} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#bottomScrim)" />
    </Svg>
  );
}

export const BottomScrim = memo(BottomScrimView);
