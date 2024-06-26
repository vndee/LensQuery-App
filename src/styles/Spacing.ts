import { Dimensions, Platform } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

const SAFE_BOTTOM = Platform.select({
  ios: StaticSafeAreaInsets.safeAreaInsetsBottom,
}) ?? 0;

export default {
  iphone_X_margin_bottom: 14,
  horizontalPadding: 12,
  verticalPadding: 10,

  ZERO: 0,
  XXS: 2,
  XS: 4,
  S: 8,
  M: 12,
  L: 16,
  XL: 24,

  inputVerticalPadding: Platform.OS === 'ios' ? 12 : 8,
  buttonVerticalPadding: Platform.OS === 'ios' ? 12 : 12,

  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,

  safePaddingLeft: StaticSafeAreaInsets.safeAreaInsetsLeft + 16,
  safePaddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + 16,
  safePaddingRight: StaticSafeAreaInsets.safeAreaInsetsRight + 16,
  safePaddingBottom: SAFE_BOTTOM + 16,

  SAFE_BOTTOM: Platform.select({
    ios: StaticSafeAreaInsets.safeAreaInsetsBottom + 8,
  }) ?? 8,
};