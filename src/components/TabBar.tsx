import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardVisible } from '../hooks/useKeyboardVisible';
import { colors, radii, typography } from '../theme';

const BAR_CONTENT_HEIGHT = 75;
const COMPACT_BAR_CONTENT_HEIGHT = 50;
const ICON_SIZE = 18;

function useIsCompact() {
  const { width, height } = useWindowDimensions();
  return width > height;
}

export function useTabBarHeight() {
  const { bottom } = useSafeAreaInsets();
  const compact = useIsCompact();
  return (compact ? COMPACT_BAR_CONTENT_HEIGHT : BAR_CONTENT_HEIGHT) + bottom;
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const height = useTabBarHeight();
  const compact = useIsCompact();
  const { bottom, left, right } = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();

  if (keyboardVisible) {
    return null;
  }

  return (
    <View
      style={[
        styles.bar,
        {
          height,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? colors.tabActive : colors.tabInactive;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            onPress={onPress}
            onLongPress={() =>
              navigation.emit({ type: 'tabLongPress', target: route.key })
            }
            style={[styles.item, compact && styles.itemCompact]}
          >
            {options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
            <Text
              style={[
                focused ? typography.tabLabelActive : typography.tabLabel,
                { color },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopLeftRadius: radii.tabBar,
    borderTopRightRadius: radii.tabBar,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  itemCompact: {
    flexDirection: 'row',
    gap: 8,
  },
});
