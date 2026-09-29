import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TriangleAlert, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer, {
  PLAYER_ERRORS,
  PLAYER_STATES,
} from 'react-native-youtube-iframe';
import { Button } from '../../components/Button';
import { useHiddenStatusBar } from '../../hooks/useStatusBar';
import type { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

const READY_TIMEOUT_MS = 15_000;
const VIDEO_ASPECT_RATIO = 16 / 9;

type Status = 'loading' | 'ready' | 'error';
type Props = NativeStackScreenProps<RootStackParamList, 'Trailer'>;

const ERROR_MESSAGES: Partial<Record<string, string>> = {
  [PLAYER_ERRORS.EMBED_NOT_ALLOWED]:
    "The studio doesn't allow this trailer to play inside apps.",
  [PLAYER_ERRORS.VIDEO_NOT_FOUND]: 'This trailer is no longer available.',
};
const FALLBACK_ERROR = "The trailer couldn't be played right now.";

export function TrailerScreen({ route, navigation }: Props) {
  const { videoKey, title } = route.params;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  useHiddenStatusBar();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState(FALLBACK_ERROR);

  const closedRef = useRef(false);
  const close = useCallback(() => {
    if (!closedRef.current) {
      closedRef.current = true;
      navigation.goBack();
    }
  }, [navigation]);

  const fail = useCallback((reason?: string) => {
    setErrorMessage((reason && ERROR_MESSAGES[reason]) || FALLBACK_ERROR);
    setStatus('error');
  }, []);

  useEffect(() => {
    if (status !== 'loading') {
      return;
    }
    const timer = setTimeout(fail, READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status, fail]);

  const onChangeState = useCallback(
    (state: PLAYER_STATES) => {
      if (state === PLAYER_STATES.ENDED) {
        close();
      }
    },
    [close],
  );

  const playerWidth = Math.min(width, height * VIDEO_ASPECT_RATIO);
  const playerHeight = playerWidth / VIDEO_ASPECT_RATIO;

  return (
    <View style={styles.screen}>
      {status === 'error' ? (
        <View style={styles.message}>
          <TriangleAlert
            color={colors.textOnImage}
            size={32}
            strokeWidth={1.5}
          />
          <Text style={styles.messageText}>{errorMessage}</Text>
          <Button
            label="Watch on YouTube"
            onPress={() =>
              Linking.openURL(`https://www.youtube.com/watch?v=${videoKey}`)
            }
          />
        </View>
      ) : (
        <View style={{ width: playerWidth, height: playerHeight }}>
          <YoutubePlayer
            videoId={videoKey}
            width={playerWidth}
            height={playerHeight}
            play
            forceAndroidAutoplay={Platform.OS === 'android'}
            onReady={() => setStatus('ready')}
            onChangeState={onChangeState}
            onError={fail}
            webViewProps={{ onError: () => fail() }}
            initialPlayerParams={{ preventFullScreen: true, rel: false }}
          />
          {status === 'loading' ? (
            <View style={styles.loading} pointerEvents="none">
              <ActivityIndicator color={colors.textOnImage} size="large" />
            </View>
          ) : null}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Close ${title} trailer`}
        onPress={close}
        hitSlop={spacing.md}
        style={[
          styles.close,
          {
            top: insets.top + spacing.md,
            left: insets.left + spacing.lg,
          },
        ]}
      >
        <X color={colors.textOnImage} size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.player,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.player,
  },
  message: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  messageText: {
    ...typography.body,
    color: colors.textOnImage,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
