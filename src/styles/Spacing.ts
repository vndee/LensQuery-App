import { Dimensions, Platform } from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

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
};