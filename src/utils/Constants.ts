import { Dimensions, Platform } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

// The maximum zoom _factor_ you should be able to zoom in
export const LENS_SCALE_FULL_ZOOM = 3;
export const LENS_MAX_ZOOM_FACTOR = 20;
export const CHAT_HISTORY_LOAD_LENGTH = 20;
export const CHAT_HISTORY_CACHE_LENGTH = 20;
export const CHAT_WINDOW_SIZE = 5;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

export const OPENAI_HOST = 'https://api.openai.com/v1/chat/completions';
export const MATHPIX_HOST = 'https://api.mathpix.com/v3/text';
export const MATHPIX_APP_ID = 'vndee_huynh_gmail_com_fc337d';