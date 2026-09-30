import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function columnsFor(width: number, minWidth: number, max: number) {
  const fit = Math.floor(width / minWidth);
  return Number.isNaN(fit) ? 1 : Math.max(1, Math.min(max, fit));
}

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return {
    width,
    height,
    isLandscape: width > height,
    insets,
    gutter: (base: number) => ({
      paddingLeft: base + insets.left,
      paddingRight: base + insets.right,
    }),
    contentWidth: (base: number) => width - base * 2 - insets.left - insets.right,
  };
}
