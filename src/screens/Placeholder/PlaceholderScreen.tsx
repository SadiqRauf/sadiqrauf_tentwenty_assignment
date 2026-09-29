import { Construction } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StateMessage } from '../../components/StateMessage';
import { useTabBarHeight } from '../../components/TabBar';
import { colors } from '../../theme';

interface PlaceholderScreenProps {
  title: string;
}

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const tabBarHeight = useTabBarHeight();

  return (
    <View style={[styles.screen, { paddingBottom: tabBarHeight }]}>
      <ScreenHeader title={title} />
      <StateMessage
        icon={Construction}
        title={`${title} is on its way`}
        message="This section isn't part of this build yet."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
