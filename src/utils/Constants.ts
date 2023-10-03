import {Dimensions, Platform} from 'react-native';
import {ISubscriptionConfig} from '../types/config';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

// The maximum zoom _factor_ you should be able to zoom in
export const LENS_SCALE_FULL_ZOOM = 3;
export const LENS_MAX_ZOOM_FACTOR = 20;
export const CHAT_HISTORY_LOAD_LENGTH = 20;
export const CHAT_HISTORY_CACHE_LENGTH = 20;
export const CHAT_WINDOW_SIZE = 5;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

export const LENSQYER_CHAT_HOST = 'https://brain.lensquery.com/api/v1';
export const OPENAI_HOST = 'https://api.openai.com/v1';
export const OPENAI_API_KEY =
  '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';
export const MATHPIX_HOST = 'https://api.mathpix.com/v3/text';
export const MATHPIX_APP_ID = 'vndee_huynh_gmail_com_fc337d';
export const PROMPTLY_HOST =
  'https://trypromptly.com/api/apps/81d7a9af-0efa-4866-9e1c-7b3253b2fac1/run';
export const PROMPTLY_TOKEN = 'ea238c544409d32a7d8d1c4c637d8cd7921cc7f5';
export const OPENROUTER_HOST = 'https://openrouter.ai/api/v1';
export const OPENROUTER_KEY =
  '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';
export const REVENUECAT_API_KEY_IOS = 'appl_tZgdchIpAdHlylHMhGkYJnpMuhf';
export const REVENUECAT_API_KEY_ANDROID = 'goog_EveBpuHAtfhlShhvHPSmOqOInuy';

export const OPENAI_KEY_HELP =
  'https://scribehow.com/shared/How_to_Create_a_Secret_Key_in_OpenAI_Platform__tN5WEq52RVqmlP6vklZ92A';
export const OPENROUTER_KEY_HELP =
  'https://scribehow.com/shared/Create_an_API_Key_for_OpenRouterai__SnRzEjEeR12UFfAWsyolKA';

export const subscriptionName = {
  lq_starter_0499_1m: 'Starter Plan',
  lq_standard_0999_1m: 'Standard Plan',
  lq_premium_1499_1m: 'Premium Plan',
};
