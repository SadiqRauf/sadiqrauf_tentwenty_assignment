import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StatusBar, type StatusBarStyle } from 'react-native';

const DEFAULT_STYLE: StatusBarStyle = 'dark-content';

export function useStatusBarStyle(style: StatusBarStyle) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, true);
      return () => StatusBar.setBarStyle(DEFAULT_STYLE, true);
    }, [style]),
  );
}

export function useHiddenStatusBar() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, 'fade');
      return () => StatusBar.setHidden(false, 'fade');
    }, []),
  );
}
