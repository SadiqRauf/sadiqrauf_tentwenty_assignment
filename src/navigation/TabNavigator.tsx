import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutGrid,
  Library,
  List,
  SquarePlay,
  type LucideIcon,
} from 'lucide-react-native';
import { TabBar } from '../components/TabBar';
import { PlaceholderScreen } from '../screens/Placeholder/PlaceholderScreen';
import type { TabParamList } from './types';
import { WatchNavigator } from './WatchNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

const tabIcon =
  (Icon: LucideIcon) =>
  ({ color, size }: { color: string; size: number }) =>
    <Icon color={color} size={size} />;

const DashboardScreen = () => <PlaceholderScreen title="Dashboard" />;
const MediaLibraryScreen = () => <PlaceholderScreen title="Media Library" />;
const MoreScreen = () => <PlaceholderScreen title="More" />;

const renderTabBar = (props: Parameters<typeof TabBar>[0]) => (
  <TabBar {...props} />
);

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Watch"
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: tabIcon(LayoutGrid) }}
      />
      <Tab.Screen
        name="Watch"
        component={WatchNavigator}
        options={{ tabBarIcon: tabIcon(SquarePlay) }}
      />
      <Tab.Screen
        name="MediaLibrary"
        component={MediaLibraryScreen}
        options={{ title: 'Media Library', tabBarIcon: tabIcon(Library) }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarIcon: tabIcon(List) }}
      />
    </Tab.Navigator>
  );
}
