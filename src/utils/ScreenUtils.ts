import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const isIphoneX = () => {
  const dimension = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimension.height >= 812 ||
      dimension.width >= 812 ||
      dimension.height >= 896 ||
      dimension.width >= 896)
  );
};

export function DynamicSize(value: number, customWidth: number, standardScreenHeight: number = 375) {
  const dynamicSize = (value * (customWidth || width)) / standardScreenHeight;
  return Math.round(dynamicSize);
}

export const ifIphoneX = (a: number, b: number) => {
  if (isIphoneX()) {
    return a;
  }
  return b;
};

export default class ScreenUtils {
  static isIphoneX() {
    return isIphoneX();
  }

  static ifIphoneX(a: number, b: number) {
    return ifIphoneX(a, b);
  }

  static getPaddingBottomIphoneX() {
    return ifIphoneX(34, 0);
  }
}