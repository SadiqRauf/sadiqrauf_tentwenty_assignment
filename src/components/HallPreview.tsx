import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import type { SeatRow } from '../services/booking';
import { colors } from '../theme';
import { seatColor } from './seatColor';

interface HallPreviewProps {
  layout: SeatRow[];
  width: number;
  height: number;
}

const PADDING = 16;
const SCREEN_AREA = 18;

export const HallPreview = memo(function HallPreviewView({
  layout,
  width,
  height,
}: HallPreviewProps) {
  const columns = Math.max(...layout.map(row => row.cells.length));
  const cell = Math.min(
    (width - PADDING * 2) / columns,
    (height - PADDING - SCREEN_AREA) / layout.length,
  );
  const seat = cell * 0.7;
  const mapWidth = cell * columns;
  const left = (width - mapWidth) / 2;
  const screenY = PADDING;

  return (
    <Svg width={width} height={height}>
      <Path
        d={`M ${left} ${screenY + 6} Q ${width / 2} ${screenY - 4} ${
          left + mapWidth
        } ${screenY + 6}`}
        stroke={colors.accent}
        strokeWidth={1}
        fill="none"
      />
      {layout.map((row, rowIndex) =>
        row.cells.map((seatCell, column) =>
          seatCell ? (
            <Rect
              key={seatCell.id}
              x={left + column * cell}
              y={screenY + SCREEN_AREA - 6 + rowIndex * cell}
              width={seat}
              height={seat}
              rx={seat * 0.25}
              fill={seatColor(seatCell, false)}
            />
          ) : null,
        ),
      )}
    </Svg>
  );
});
