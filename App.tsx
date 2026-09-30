import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OfflineBanner } from './src/components/OfflineBanner';
import { RootNavigator } from './src/navigation/RootNavigator';
import { subscribeAppFocus } from './src/services/appFocus';
import { persistOptions } from './src/services/persistence';
import { queryClient } from './src/services/queryClient';
import { colors } from './src/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background },
};

function App() {
  useEffect(subscribeAppFocus, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
        <OfflineBanner />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
