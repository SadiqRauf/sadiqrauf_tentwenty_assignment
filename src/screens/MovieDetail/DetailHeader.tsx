import { ChevronLeft } from 'lucide-react-native';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomScrim } from '../../components/BottomScrim';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { TrailerButton } from './TrailerButton';

const HEADER_HEIGHT_RATIO = 0.57;

interface DetailHeaderProps {
  title: string;
  imageUri?: string;
  releaseLabel?: string;
  trailer?: { loading: boolean; onPress?: () => void };
  onGetTickets: () => void;
  onBack: () => void;
}

export function DetailHeader({
  title,
  imageUri,
  releaseLabel,
  trailer,
  onGetTickets,
  onBack,
}: DetailHeaderProps) {
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { height: height * HEADER_HEIGHT_RATIO }]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          accessible
          accessibilityRole="image"
          accessibilityLabel={`${title} poster`}
        />
      ) : null}
      <BottomScrim start={0.35} opacity={0.85} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Watch"
        onPress={onBack}
        hitSlop={spacing.md}
        style={[styles.back, { top: top + spacing.md }]}
      >
        <ChevronLeft color={colors.textOnImage} size={24} />
        <Text style={styles.backLabel}>Watch</Text>
      </Pressable>

      <View style={styles.footer}>
        {releaseLabel ? (
          <Text style={styles.release}>{releaseLabel}</Text>
        ) : null}
        <View style={styles.actions}>
          <Button
            label="Get Tickets"
            size="large"
            onPress={onGetTickets}
            style={styles.action}
          />
          {trailer ? (
            <TrailerButton
              loading={trailer.loading}
              onPress={trailer.onPress}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tabBar,
    justifyContent: 'flex-end',
  },
  back: {
    position: 'absolute',
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backLabel: {
    ...typography.screenTitle,
    color: colors.textOnImage,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  actions: {
    gap: spacing.sm + 2,
    marginTop: spacing.xs,
  },
  action: {
    width: 243,
  },
  release: {
    ...typography.releaseLabel,
    color: colors.textOnImage,
    textAlign: 'center',
  },
});
