import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

const getOnline = () => onlineManager.isOnline();

export function useIsOnline() {
  return useSyncExternalStore(onlineManager.subscribe, getOnline, getOnline);
}

export const isOfflineWithoutData = (query: {
  isPending: boolean;
  fetchStatus: string;
}) => query.isPending && query.fetchStatus === 'paused';

let reconnects = 0;
let wasOnline = onlineManager.isOnline();
onlineManager.subscribe(online => {
  if (online && !wasOnline) {
    reconnects += 1;
  }
  wasOnline = online;
});
const getReconnects = () => reconnects;

export function useReconnectCount() {
  return useSyncExternalStore(
    onlineManager.subscribe,
    getReconnects,
    getReconnects,
  );
}
