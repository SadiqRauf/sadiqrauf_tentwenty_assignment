import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MovieDetailScreen } from '../screens/MovieDetail';
import { SeatSelectionScreen } from '../screens/SeatSelection';
import { ShowtimesScreen } from '../screens/Showtimes';
import { TrailerScreen } from '../screens/Trailer';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="Showtimes" component={ShowtimesScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen
        name="Trailer"
        component={TrailerScreen}
        options={{
          presentation: 'fullScreenModal',
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
}
