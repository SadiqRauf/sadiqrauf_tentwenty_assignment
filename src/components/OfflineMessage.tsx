import { WifiOff } from 'lucide-react-native';
import { StateMessage } from './StateMessage';

export function OfflineMessage({ subject }: { subject: string }) {
  return (
    <StateMessage
      icon={WifiOff}
      title="You're offline"
      message={`${subject} will load as soon as you're back online.`}
    />
  );
}
