import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MovieDetailScreen } from '../screens/MovieDetail';
import { TrailerScreen } from '../screens/Trailer';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, orientation: 'portrait_up' }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen
        name="Trailer"
        component={TrailerScreen}
        options={{
          presentation: 'fullScreenModal',
          animation: 'fade',
          orientation: 'all',
        }}
      />
    </Stack.Navigator>
  );
}
