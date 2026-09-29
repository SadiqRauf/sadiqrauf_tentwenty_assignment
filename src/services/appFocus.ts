import { focusManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

export function subscribeAppFocus() {
  const subscription = AppState.addEventListener('change', status => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });
  return () => subscription.remove();
}
