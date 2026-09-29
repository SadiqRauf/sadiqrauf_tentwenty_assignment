import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MovieListScreen } from '../screens/MovieList';
import { SearchResultsScreen, SearchScreen } from '../screens/Search';
import type { WatchStackParamList } from './types';

const Stack = createNativeStackNavigator<WatchStackParamList>();

export function WatchNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MovieList" component={MovieListScreen} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    </Stack.Navigator>
  );
}
