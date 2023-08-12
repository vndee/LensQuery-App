import { Dimensions, Platform } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

// The maximum zoom _factor_ you should be able to zoom in
export const LENS_SCALE_FULL_ZOOM = 3;
export const LENS_MAX_ZOOM_FACTOR = 20;
export const CHAT_HISTORY_LOAD_LENGTH = 5;
export const CHAT_HISTORY_CACHE_LENGTH = 5;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;